---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Ownership & Borrowing
---

# **Ownership & Borrowing**

## **Why Ownership Exist**
***

Every program needs to manage memory. There are broadly three approaches:

| Approach | Example languages | Trade-off |
| -- | -- | -- |
| Manual management | C, C++* | Fast, but error-prune (use after free, double free, leaks) |
| Garbage collection | Java, Python, Go | Safe, but runtime overhead (GC pauses, memory bloat) |
| Ownership | Rust | Safe and fast, but stricter compiler |

Rust's approach: If the compiler can statically prove, at compile time, exactly when memory is no longer needed, it can insert the free() call automatically  with zero runtime cost and zero risk of getting it wrong. Ownership is the set of rules that make this proof possible.

A note on C++* : Modern C++ (C++11+) isn't purely manual either. RAII, move semantics, and smart pointers (unique_ptr, shared_ptr) already automate a lot of this, and are conceptually close to Rust's model. Modern C++ gives you the tools to approximate Rust's safety, if used consistently everywhere, by everyone, forever. Rust makes the safe path the only reachable path in ordinary code, and proves it rather than relying on convention.

## **Ownership Rules**
***

The Three Ownership Rules:
1. Each value has a single owner (a variable binding).
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped (memory freed).

```rust
{
    let s = String::from("hello"); // s owns the String
    // ... use s ...
} // scope ends -> s is dropped -> memory freed automatically
```

## **Move Semantics**
***

For heap-allocated / non-`Copy` types, assignment transfers ownership rather than copying:
```rust
let s1 = String::from("hello");
let s2 = s1;          // ownership moves from s1 to s2

println!("{}", s1);   // COMPILE ERROR: value borrowed after move
```

After `let s2 = s1;`, `s1` is considered no longer valid. Only `s2` owns the data now. The compiler enforces this, and using `s1` afterward is a compile error, not a runtime bug.

**The `Copy` trait: the exception**

Simple stack-only types (i32, f64, bool, char, tuples of Copy types) implement `Copy`. Assignment for these clones the value instead of moving it, because duplicating them is cheap and has no aliasing/ownership concerns (no heap pointer to double-free).

**Moves and function calls**

Passing a value to a function moves it too, unless the type is `Copy` or you pass a reference:
```rust
fn takes_ownership(s: String) {
    println!("{s}");
} // s dropped here

let s = String::from("hi");
takes_ownership(s);
// s is no longer valid here - it was moved into the function
```

**Explicit copying: .clone()**

If you genuinely want a deep copy (duplicate the heap data, not just move the pointer), call .clone() explicitly:
```rust
let s1 = String::from("hello");
let s2 = s1.clone(); // deep copy - both s1 and s2 are valid, independent
```

## **Borrowing**
***

Constantly moving values in and out of functions is impractical. Borrowing lets you access a value without taking ownership, via references (`&`).

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
} // s goes out of scope, but since it doesn't own the data, nothing is dropped

let s1 = String::from("hello");
let len = calculate_length(&s1); // borrow s1, don't move it
println!("{s1} has length {len}"); // s1 still valid!
```

## **Borrowing Rules**
***

At any given time, for a particular piece of data `T`, you may have either:
1. Any number of shared borrow (`&T`), or
2. Exactly one mutable reference (`&mut T`)

..but never both simultaneously. Borrows must also always be valid (no dangling references).
```rust
let mut s = String::from("hello");

let r1 = &s;       // ok
let r2 = &s;       // ok - multiple exclusive borrows fine
println!("{r1} {r2}");

let r3 = &mut s;   // ok, as long as r1/r2 are no longer used after this point
println!("{r3}");
```

```rust
let mut s = String::from("hello");
let r1 = &mut s;
let r2 = &mut s;   // COMPILE ERROR: cannot borrow `s` as mutable more than once
```

This is Rust's central innovation: the **"aliasing XOR mutability"** principle. It's precisely the condition needed to rule out data races and iterator invalidation bugs at compile time:
* If code holds a borrow and reads through it, and simultaneously other code can mutate the same data through another borrow, you get race conditions (in concurrent code) or invalidated assumptions (e.g. a vector reallocating while you hold a pointer into its old buffer)
* By ensuring a mutable borrow is always exclusive, the compiler guarantees that if you have `&mut T`, nothing else can read or write that data through another path while your borrow is alive. This is what allows the compiler (and programmers) to reason locally about code - "I have `&mut T`, so I know nobody else can be looking at this right now."

**Reference scope ("Non-Lexical Lifetimes")**

A reference's scope is based on where it's last used, not the enclosing block. This is called NLL (Non-Lexical Lifetimes), a compiler feature that makes the borrow checker less conservative than early Rust:
```rust
let mut s = String::from("hello");

let r1 = &s;
let r2 = &s;
println!("{r1} {r2}");
// r1, r2's last use was above - they're "dead" here

let r3 = &mut s; // OK! r1/r2 are no longer considered "alive"
println!("{r3}");
```

## **Dangling References**
***

Rust's borrow checker guarantees references can never outlive the data they point to. This eliminates dangling pointers entirely, a common source of undefined behavior in C/C++.
```rust
fn dangle() -> &String {       // COMPILE ERROR
    let s = String::from("hello");
    &s
} // s is dropped here, the reference would point to freed memory
```
The compiler rejects this at compile time. The fix is to return the owned String itself (transfer ownership out), not a reference to a local:
```rust
fn no_dangle() -> String {
    let s = String::from("hello");
    s // ownership moved out, valid
}
```