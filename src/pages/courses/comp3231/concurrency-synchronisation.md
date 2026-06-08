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
