---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Concurrency
---

# **Concurrency**

## **Why Concurrency is Hard**
***

Concurrent programs are prone to a specific, brutal class of bug: data races - two threads accessing the same memory at the same time, where at least one access is a write, without synchronisation. Data races cause undefined behavior, are timing-dependent (so they may not show up in testing), and are notoriously difficult to reproduce and debug in languages like C++ or Java, where nothing stops you from sharing mutable data across threads by accident.

Rust's core concurrency claim: "fearless concurrency." The same ownership and borrowing rules before, designed originally to prevent single-threaded memory bugs, turn out to also prevent data races, because a data race is really just a violation of the "aliasing XOR mutability" rule, extended across threads instead of within one. Rust doesn't bolt on a separate concurrency-safety system; it reuses the type system you already know, and the compiler catches most concurrency bugs at compile time, not via runtime crashes or (worse) silent corruption.

## **Thread Basics**
***

```rust
use std::thread;

let handle = thread::spawn(|| {
    println!("hello from a spawned thread");
});

handle.join().unwrap(); // block until the spawned thread finishes
```
* `thread::spawn` takes a closure and runs it on a new OS thread.
* It returns a `JoinHandle<T>` - calling `.join()` blocks the current thread until the spawned one finishes, and returns its result (`Result<T, ...>`, `Err` if the thread panicked).
* If you don't `.join()`, the main thread may exit before the spawned thread finishes - spawned threads don't automatically get waited for.

### Moving data into threads

```rust
let data = vec![1, 2, 3];

let handle = thread::spawn(move || {
    println!("{:?}", data);
});
```

The `move` keyword forces the closure to take ownership of everything it references (`data`, here), rather than borrowing it. Without move, the closure would try to borrow data, but the compiler can't guarantee the spawned thread won't outlive the borrow (threads can run for an unpredictable, unbounded duration, and outlive the main thread), so it requires the closure to own its data outright instead, sidestepping the lifetime problem entirely by transferring ownership rather than borrowing.

```rust
let data = vec![1, 2, 3];
let handle = thread::spawn(|| { // no `move`
    println!("{:?}", data); // COMPILE ERROR: closure may outlive borrowed `data`
});
```

### **Scoped Threads**
***

The `move` requirement above exists because `thread::spawn` can't prove the spawned thread finishes before its captured data goes out of scope. `std::thread::scope` gives the compiler that missing proof, letting threads borrow data instead of requiring ownership transfer.
```rust
use std::thread;

let data = vec![1, 2, 3];

thread::scope(|s| {
    s.spawn(|| {
        println!("{:?}", data); // borrows `data`, no `move` needed
    });
    s.spawn(|| {
        println!("length: {}", data.len()); // multiple threads can share an immutable borrow
    });
}); // scope block guarantees ALL spawned threads have finished by this point

println!("{:?}", data); // data is still usable here, it was only borrowed
```
* `thread::scope` takes a closure that receives a scope handle (`s`), and any threads spawned via `s.spawn(...)` are guaranteed by to be joined automatically before `thread::scope` itself returns.
* Because the compiler can see that guarantee structurally, it can now prove a borrow of `data` can't outlive the threads using it.
* `thread::scope` doesn't change any rule, it just gives the borrow checker a lexical scope it can reason about, the same way any other borrow's validity is tied to an enclosing block.

#### Why not just always use scoped threads?

Scoped threads are strictly more restrictive in one sense: every spawned thread must finish before the scope call returns. You can't spawn a long-running background thread that outlives the function that created it, the way plain `thread::spawn` allows. 

Use `thread::scope` when threads are doing bounded, "parallelize this chunk of work" tasks over local data (the common case, and avoids needing Arc/move entirely); use plain `thread::spawn` when you genuinely need a thread whose lifetime isn't tied to the spawning function's scope.

## **Send and Sync**
***

`Send` and `Sync` are two marker traits, **automatically implemented by the compiler** for most types, that formalize what's safe to share across threads.
| Trait | Means | Example types that DON'T implement it |
|---|---|---|
| `Send` | A value of this type can be safely transferred (moved) to another thread | `Rc<T>` (non-atomic refcount) |
| `Sync` | A reference to this type (`&T`) can be safely shared between threads simultaneously | `RefCell<T>` (unsynchronized interior mutability) |

* **Marker traits** carry no methods, they exist purely as compile-time labels the compiler checks.
* `thread::spawn`'s closure requires its captured data to be `Send`. This is enforced as an ordinary trait bound (no special concurrency checker).

## **Sharing Data Between Threads**
***

### `Mutex<T>` - mutual exclusion

```rust
use std::sync::Mutex;

let m = Mutex::new(5);

{
    let mut num = m.lock().unwrap(); // blocks until the lock is available
    *num += 1;
} // lock automatically released here

println!("{:?}", m);
```

`Mutex<T>` doesn't just wrap a value with a lock the way `pthread_mutex_t` does in C - the lock and the data it protects are the same object. The only way to access the inner `T` is through `.lock()`, which returns a `MutexGuard<T>`.

The `MutexGuard` releases the lock automatically when it goes out of scope, so you can't forget to unlock, which is a common bug source in manual-locking languages.

### Combining with Arc<T> for multiple owners

A `Mutex<T>` alone still has a single owner. To let multiple threads share access to the same Mutex, wrap it in `Arc<T>`:
```rust
use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let counter = Arc::clone(&counter); // clone the Arc, not the data
    let handle = thread::spawn(move || {
        let mut num = counter.lock().unwrap();
        *num += 1;
    });
    handles.push(handle);
}

for handle in handles {
    handle.join().unwrap();
}

println!("Result: {}", *counter.lock().unwrap()); // 10
```

`Arc<Mutex<T>>` is the idiomatic Rust pattern for "shared, mutable state across threads".

## **Deadlocks**
***

`Mutex<T>` prevents data races at compile/runtime, but it does not prevent deadlocks (e.g. two threads each waiting on a lock the other holds). Rust's ownership/borrowing model rules out data races by construction, but deadlock avoidance is a logical/ordering property the type system doesn't (and largely can't) encode. It's still the programmer's responsibility, same as in any other language.

## **Message Passing: Channels**
***

An alternative concurrency model to shared-memory-plus-locking: instead of multiple threads touching the same data, threads send values to each other and only one thread owns the data at any given time. Rust's standard library provides multi-producer, single-consumer channels:

```rust
use std::sync::mpsc; // "multiple producer, single consumer"
use std::thread;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    let val = String::from("hi");
    tx.send(val).unwrap(); // ownership of `val` moves into the channel
    // println!("{val}"); would be a COMPILE ERROR - val was moved
});

let received = rx.recv().unwrap();
println!("Got: {received}");
```

`tx` can be cloned to allow multiple sending threads (`mpsc` = multiple producer), while `rx` stays single-consumer.