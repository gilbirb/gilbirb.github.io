---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Concurrency and Synchronisation
---

## **Concurrency**
***

Concurrency is an issue in operating systems and multithreaded applications.

### **Concurrency Example**
***

```c
void increment () {        void decrement () {
    int t;                     int t;
    t = count;                 t = count;
    t = t + 1;                 t = t - 1;
    count = t;                 count = t;
}                          }
```

* `count` is a **global** variable shared between two threads, `t` is a **local** variable.
* After increment and decrement complete, what is the value of `count`?
    * It depends on the interleaving of the two threads - we have a **race condition**.

### **Where is the concurrency?**
***

Concurrency can appear in several configurations:

* **Multiple single-threaded processes**: three processes each with one thread, running concurrently.
* **A single multithreaded process**: one process with three threads sharing its address space.
* **In-kernel concurrency**, which exists *even for single-threaded processes*.
    * Each process has a user-level stack/execution state and a separate in-kernel stack/execution state, so their kernel-side execution can interleave.

## **Critical Region**
***

* We can control access to a shared resource by controlling access to the code that accesses the resource.
* A **critical region** is a region of code where shared resources are accessed.
    * Variables, memory, files, etc.
* Uncoordinated entry to the critical region results in a **race condition**
    * Incorrect behaviour, deadlock, lost work, ...

### **Identifying critical regions**
***

Critical regions are regions of code that:

* Access a shared resource, **and**
* correctness relies on the shared resource not being concurrently modified by another thread/process/entity.

## **Critical Region Solutions**
***

We seek a solution to coordinate access to critical regions (also called *critical sections*). Conditions required of **any** solution:

1. **Mutual Exclusion**: No two processes simultaneously in the critical region.
2. **Progress**: No process running outside its critical region may block another process.
3. **Non-Starvation**: No process waits forever to enter its critical region.
4. **Generality**: A solution that only works for 2 CPUs isn't a good solution.

### **Attempt 1: A lock variable**
***

* If `lock == 1`, somebody is in the critical section and we must wait.
* If `lock == 0`, nobody is in the critical section and we are free to enter.

```c
while (TRUE) {
    while (lock == 1)
        ;
    lock = 1;
    critical();
    lock = 0;
    non_critical();
}
```

* **Problem:** the test (`while (lock == 1)`) and the set (`lock = 1`) are not atomic. Both threads can read `lock == 0`, both set it to `1`, and both enter the critical section.
* Testing for concurrency errors is tricky - it's easier to show something *doesn't* work (a counter-example) than to prove it does. Some problematic sequences are quite unlikely (e.g. a timer interrupt arriving exactly after reading the lock).

### **Attempt 2: Mutual Exclusion by Taking Turns**
***

```c
/* Process 0 */              /* Process 1 */
while (TRUE) {               while (TRUE) {
    while (turn != 0)            while (turn != 1)
        /* loop */ ;                /* loop */ ;
    critical_region();          critical_region();
    turn = 1;                   turn = 0;
    noncritical_region();       noncritical_region();
}                            }
```

* Works due to **strict alternation** - each process takes turns.
* **Cons:**
    * **Busy waiting.**
    * A process may wait to enter the critical section while the other is doing non-critical work (worse with many processes).
    * Enforcing a fixed schedule in a concurrent environment doesn't work well.

### **Attempt 3: Disabling Interrupts**
***

```c
while (TRUE) {
    disable_interrupts();
    critical();
    enable_interrupts();
    non_critical();
}
```

* **Pros:** simple.
* **Cons:**
    * Only available in the kernel.
    * Delays everybody else, even with no contention (slows interrupt response time).
    * Does **not** work on a multi-core processor.

## **Core Problem: Read and Update**
***

* We don't want a fixed schedule.
* If multiple threads (A, B, C) can enter the critical section, thread A needs to do two things:
    * **Read** the current state - to know B/C have not gone into their critical sections.
    * **Change** the state - to inform B/C that A is entering.
* This can be done in memory by **Peterson's algorithm**, but it doesn't work on modern hardware.

## **Hardware Support for Mutual Exclusion**
***

### **Test-and-Set (TSL)**
***

* Tests memory cell X and sets memory cell X - used to implement lock variables correctly.
* It loads the value of the lock:
    * If `lock == 0`, set the lock to `1` and return `0` - we **acquire** the lock.
    * If `lock == 1`, return `1` - another thread/process has the lock.
* The hardware guarantees the instruction executes **atomically** (both the read-lock and set-lock parts), i.e. as an indivisible unit.

```asm
enter_region:
    TSL r0, lock      | copy lock to r0, set lock to 1
    CMP r0, #0        | was lock 0?
    JNE enter_region  | if not, loop again
    RET               | done, return to caller

leave_region:
    MOVE lock, #0     | store 0 (unlocked) in lock
```

### **Simple Test-and-Set Lock**
***

* **Pros:**
    * Simple (easy to see it is correct).
    * Available at user-level, to any number of processors, for any number of lock variables.
* **Cons:**
    * **Busy waits** (also termed a *spin lock*) - consumes CPU.
    * Starvation might be possible when a process leaves its critical section and more than one process is waiting.

### **Variants of Test-and-Set**
***

Modern processors provide other synchronisation operations:

* **Compare-and-Swap** - check the contents of X is Y, and if so write Z.
* **Load-Link / Store-Exclusive** - the store fails if the linked memory address has been accessed.
* **Atomic Arithmetic** - e.g. atomic increment by 1.

### **Tackling the Busy-Wait Problem**
***

In basic hardware locking (like a Test-and-Set spinlock), a thread continuously loops in CPU cycles checking if a lock is free. This wastes significant processor time.

* **Sleep System Call**: Instead of continuously spinning, a user-level thread unable to acquire a lock can invoke sleep to block itself, yielding the CPU to other productive tasks until the lock becomes available.
* **Wakeup System Call**: When the thread holding the lock finishes its critical section and releases the resource, it calls wakeup to notify and unblock the sleeping thread(s).
* If a thread calls wakeup when no other threads are currently asleep, the call simply has no effect.

## **The Producer-Consumer Problem**
***

* Also called the *bounded buffer* problem
* A producer thread generates data items and places them into a shared, fixed-capacity buffer, 
* A consumer thread retrieves and consumes those items.

<img src="/assets/images/comp3231/produce-consume.png" alt="" width="80%" style="display:block;margin:1rem auto;"/>

Producer
* should sleep when the buffer is full,
* and wakeup when there is empty space in the buffer
    * The consumer can call wakeup when it consumes the first entry of the full buffer

Consumer
* should sleep when the buffer is empty 
* and wake up when there are items available
    *  Producer can call wakeup when it adds the first item to the buffer

**Issues**
* Both threads modifying the buffer simultaneously without mutual exclusion causes **race conditions**.
* Concurrently modifying `count` leads to incorrect tracking.
* If a context switch occurs after a thread checks the condition (e.g., `count == 0`) but before it actually calls `sleep()`, a wakeup sent by the other thread can be permanently lost, causing threads to block indefinitely.

## **Semaphores**
***

Semaphores are an atomic, integer-based synchronization primitive designed by Edsger Dijkstra to manage resource access without busy-waiting.
* **P()**: *proberen*, from Dutch to test. Also called **wait** or down.
    * Decrements the count. If the resource is unavailable ($\text{count} \le 0$), the calling process is placed onto the wait queue and put to sleep.
* **V()**: *verhogen*, from Dutch to increment. Also called **signal** or up.
    * Increments the count. If any processes are sleeping on the queue, one is unblocked and resumed. If no processes are waiting, the signal is preserved by incrementing the count for future consumers (preventing lost wakeups).

Both $P()$ and $V()$ execute **atomically** so condition checks and queue updates cannot be interleaved.

### **Semaphore Implementation**

Define a semaphore as a record
```c
typedef struct {
 int count;
 struct process *L; // A linked list (or queue) of process/thread descriptors representing tasks currently waiting for a resource.
} semaphore;
```

Assume two simple operations:
* **sleep** suspends the process that invokes it.
* **wakeup(P)** resumes the execution of a blocked process P.

Semaphore operations now defined as
```c
wait(S):
while (S.count <= 0) {
 add this process to S.L;
 sleep;
}
S.count--;

signal(S):
S.count++;
if (S.count <= 1) {
 remove a process P from S.L;
 wakeup(P);
}

```

### **Key Applications**
***
* **Mutual Exclusion (Mutex)**: Initializing a semaphore to 1 restricts access to exactly one thread at a time ($N=1$), behaving as a standard lock (wait(mutex) $\rightarrow$ critical() $\rightarrow$ signal(mutex)).
* **Bounded Buffer Coordination**: Solves the Producer-Consumer problem cleanly using three semaphores: mutex = 1 (mutual exclusion), empty = N (tracking empty slots), and full = 0 (tracking filled slots).

While powerful, semaphores are low-level and prone to bugs. Omitting a signal, duplicate waits, or acquiring semaphores in the wrong order can easily cause deadlocks.

## **Monitors**
***

* A higher-level synchronisation primitive construct proposed by Hoare (1974).
* Is a programming language construct: A feature or building block defined directly by the grammar and runtime rules of a programming language, rather than provided as an external library or operating system function.

It encapsulates shared variables, procedures, and data types into a module where the compiler automatically guarantees that only one thread can execute inside at any given time (such as synchronized methods in Java).

## **Condition Variables**
***

Because monitors enforce mutual exclusion, threads still need a way to block and wait for specific application events (like a buffer becoming non-empty) without holding the monitor lock.
* `wait(c)`: Suspends the calling thread and automatically releases the monitor lock so other threads can enter.
* `signal(c)`: Resumes one suspended thread waiting on the condition variable. If no threads are waiting, the signal has no effect (unlike a semaphore count).

## **Dining Philosophers Problem**
***

* 5 philosophers sit around a circular table alternating between thinking and eating.
* There are 5 forks placed between them; eating requires holding both the left and right fork.
<img src="/assets/images/comp3231/dining.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

### **A Flawed Solution**

* **Approach**: Each fork is represented by a semaphore initialized to 1. A philosopher runs:
```c
take_fork(left);
take_fork(right);
eat();
put_fork(left);
put_fork(right);
```

* **Failure (Deadlock)**: If all 5 philosophers pick up their left fork simultaneously, none can acquire their right fork. Everyone blocks permanently in a circular wait.

### **The Correct Solution**

Use an array of states (`THINKING`, `HUNGRY`, `EATING`), a mutex semaphore, and per-philosopher semaphores ($s[N]$ initialized to 0):

* `take_forks(i)`:
    1. Acquires `mutex` to safely inspect/modify state.
    2. Sets `state[i] = HUNGRY`.
    3. Calls `test(i)`, which checks if philosopher $i$ is `HUNGRY` and neither neighbor is `EATING`. If true, sets `state[i] = EATING` and calls `V(s[i])`.
    4. Releases `mutex`.
    5. Calls `P(s[i])`. If the forks were available, it passes through immediately; otherwise, it blocks safely.
* `put_forks(i)`:
    1. Acquires `mutex`.
    2. Sets `state[i] = THINKING`.
    3. Calls `test(LEFT)` and `test(RIGHT)` to wake up either waiting neighbor if their required forks just became free.
    4. Releases `mutex`.

## **Readers and Writers Problem**
***

Models concurrent access to a shared resource (such as a database or file system).
* Readers: Multiple reader threads can read concurrently without conflict.
* Writers: A writer thread requires strict exclusive access (no other writers and no readers can access the resource simultaneously).

**The Semaphore Solution:**
* `mutex` Semaphore (initialized to 1): Protects mutual exclusion when updating the shared `readcount` integer.
* `wrt` Semaphore (initialized to 1): Controls exclusive access for writing to the database/resource.
* Reader Logic:
    * First reader to arrive (`readcount == 1`) calls `wait(wrt)` to lock out writers.
    * Readers increment/decrement `readcount` inside the `mutex` critical section.
    * Last reader to leave (`readcount == 0`) calls `signal(wrt)` to allow waiting writers to enter.
* Writer Logic:
    * Calls `wait(wrt)` before writing and `signal(wrt)` upon completion.

**Trade off**: In this specific implementation (reader-preference), continuous arrivals of new readers will keep readcount > 0, causing waiting writers to starve indefinitely.