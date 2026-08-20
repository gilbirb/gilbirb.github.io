---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Multiprocessor Systems
---

## **Multiprocessor System**
***

**Definition**: A system containing more than one processor (CPU) that all share access to the same physical memory.

Primary Motivations:
* **Performance**: A single CPU core can only go so fast due to hardware/physical limitations. Adding more CPUs is the primary way to continue improving processing performance.
    * Adding more CPUs only speeds up computation if assuming:
        1. **Parallelizable Workload**: The software or task must be able to be broken down into parts that execute simultaneously across multiple cores/CPUs.
        2. **Not I/O or Memory Bound**: If the application is constantly waiting for disk/network transfers (I/O-bound) or saturated memory buses (memory-bound), adding more compute cores will not improve performance.
* **Cost Efficiency**: Dedicated hardware components like disks, main memory, and network interfaces are expensive. A multiprocessor architecture allows multiple CPUs to share these expensive hardware rather than building separate machines.

## **Amdahl’s Law**
***

Determines the maximum theoretical speedup a program can achieve when using multiple processors.

$$
\text{Speedup} = \frac{1}{(1-P) + \frac{P}{N}}
$$
* $P$: The proportion of the program that can be parallelized.
* $(1 - P)$: The remaining serial portion that must run sequentially.
* $N$: The number of processors.

<img src="/assets/images/comp3231/amdahl-1.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

Initial Setup (1 Processor):
* Total time = $100$ units.
* Serial portion = $50$ units ($1 - P = 0.5$).
* Parallel portion = $50$ units ($P = 0.5$).

With 2 Processors ($N = 2$):
* The serial portion still takes $50$ units.
* The parallel portion is split across 2 cores: $\frac{50}{2} = 25$ units.
* New execution time = $50 + 25 = 75$ units.
* Speedup:

$$\text{Speedup} = \frac{1}{0.5 + \frac{0.5}{2}} = \frac{1}{0.75} \approx 1.33$$

* Result: Adding a second processor only yields a $1.33\times$ speedup (not $2\times$) because half the program remains sequential.

Amdahl’s Law highlights the diminishing returns of adding more CPU cores. **The serial component (1−P) creates a hard performance ceiling**, regardless of how many cores/CPUs you throw at the workload.

## **Bus-Based Uniform Memory Access**
***

Simplest multiprocessor architecture: All processors share a single bus to access main memory.
* Bus controller or mechanism resolves parallel access.
* Access to all memory occurs at roughly the same speed for all processors.
* The Problem: Since all CPUs share a single bus, as you add more CPUs, bus bandwidth becomes a bottleneck.

<img src="/assets/images/comp3231/uma.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

## **Multiprocessor Caches**
***

To reduce bus traffic, each processor has a cache to reduce its need for access to memory.
* Hopefully most accesses are performed in the local cache.
* Bus bandwidth still becomes a bottleneck with many CPUs.
* Software behaviour affects the CPU/memory tradeoff.

<img src="/assets/images/comp3231/mp-cache.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

However, this introduces the Cache Coherence Problem:

The Problem:
* What happens if CPU 1 writes to memory address 0x1234 (updating its local cache), and CPU 2 subsequently reads from 0x1234?
* Without coordination, CPU 2 reads stale data from its own local cache or main memory.

The Solution:
* Modern hardware handles consistency automatically
* When a CPU writes to an address, it either propagates the new value or invalidates that cached entry in all other CPU caches.
* Trade-off: These cache transactions consume bus bandwidth as well.

## **Multi-core Processor**
***

<img src="/assets/images/comp3231/mcp.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>

Modern CPUs place multiple cores on a single die, each with private L1 caches, sharing an L2/L3 cache and bus interface before hitting main memory.

## **Bus-Based UMA Multiprocessors**
***

UMA = Uniform Memory Architecture

* Caching helps reduce bus traffic, but bus bandwidth remains a hard limit for UMA
* Alternative architectures like NUMA (Non-Uniform Memory Access) use separate buses to improve bandwidth

## **Summary**
***

Multiprocessors can:
* Increase computation power beyond that available from a single CPU
* Share resources such as disk and memory

However,
* Assumes a workload which can run in parallel
* Assumes not I/O or memory limited
* Shared buses (bus bandwidth) limit scalability
    * Bus bandwidth can be boosted via hardware design
    * Bus contention can be reduced by careful software design
    * Good cache locality together with limited data sharing where possible

## **Approaches to Multiprocessor OS Structure**
***

### Each CPU Runs Its Own OS (Static Partitioning)
***

Physical memory and peripherals are statically divided among CPUs.

**Pros**: Simple to implement, avoids kernel-level concurrency issues, and eliminates shared serial bottlenecks.

**Issues**: Inflexible resource utilization. One CPU can have an overloaded scheduling queue while others are idle, or one CPU can thrash while free memory cannot be shared across partitions.

<img src="/assets/images/comp3231/static-partitioning.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>

### **Symmetric Multiprocessing (SMP)**
***

A single shared OS kernel executes across all processors to balance workloads dynamically.

Issue: Real concurrency in the kernel

The "Big Lock" Approach: A single global mutex protects the entire kernel. While simple, this creates a **severe serialization bottleneck** as CPU counts increase.

Fine-Grained Subsystem Locking: Breaking the kernel into independent critical sections allows parallel execution, but introduces complexity, potential deadlocks, and the need for strict lock ordering.

<img src="/assets/images/comp3231/smp.png" alt="" width="70%" style="display:block;margin:1rem auto;"/>

Real-world examples (such as early UNSW servers and Linux kernel history) showed that adding more CPUs can worsen performance if they end up contending on internal kernel locks (e.g., virtual memory subsystems).

## **Multiprocessor Synchronisation**
***

Why Disabling Interrupts Fails: Unlike uniprocessors, disabling interrupts on one core does not stop other cores from executing instructions concurrently. Hardware-level atomic primitives are required.

**Test-and-Set (TSL) Spinlocks:**

Waiting CPUs sit in a loop constantly running the `TSL` instruction.

The Problem: Every time a CPU runs `TSL`, it tries to write to the lock variable. This constantly locks the shared communication bus and forces every other core's cache to delete its copy of the lock.

Result: Heavy traffic on the shared bus that slows down every CPU in the entire system, even those not trying to get the lock.

```assembly
enter_region:
    TSL r0, lock        | copy lock to r0, 1 to lock
    CMP r0, #0,         | compute whether lock was 0
    JNE enter_region    | if not, loop again
    RET                 | done, return to caller

leave_region:
    MOVE lock, #0       | store 0 (unlocked) in lock
```

**Test-and-Test-and-Set (Spin on Read):**

Instead of trying to write every iteration, waiting CPUs simply read the lock locally in their own cache until they notice it has been freed.

Once the lock is released, only then do they try to grab it using `TSL`.

The Problem: While it eliminates bus traffic while waiting, the moment the lock is released, all waiting CPUs notice at the same exact time and rush to write to memory simultaneously. This sudden rush of traffic slows down the CPU currently trying to do real work.

```c
start:
while (lock == 1)
    ;
r = TSL(lock);  // Sees that lock == 0; Attempts to acquire lock!
if (r == 1)     // If r == 1, then some other process acquired the lock; repeat from start
    goto start;
```

**Comparison of Simple Spinlocks**

* Test and set
```c
void lock (volatile lock_t *l) {
    while (test_and_set(l)) ;
}
```

* Read before Test and Set
```c
void lock (volatile lock_t *l) {
    while (*l == BUSY || test_and_set(l)) ;
}
```

### **Spinning vs. Blocking**
***

Single-CPU vs. Multi-CPU Tradeoff:
* On a single CPU, spinning is completely pointless as the CPU is wasting time waiting for a lock that cannot be released until the current thread yields the CPU.
* On a multi-core CPU, the thread holding the lock might be running on a different core right now and could finish in just a few clock cycles.

The Cost of Context Switching:
* Putting a thread to sleep and waking it up (blocking) requires two full context switches. This involves saving/restoring CPU registers and losing cached memory data.
* Rule of Thumb: If the critical section is very short, spinning wastes fewer cycles than the overhead of putting the thread to sleep and waking it back up.

Rules for Using Spinlocks:
* Spinlocks must only protect tiny, fast sections of code.
* Do not do slow tasks like disk/network I/O or wait for sleep inside a spinlock.
* OS kernels disable local interrupts while holding a spinlock to prevent the lock-holder from being paused midway by the scheduler, which would leave other CPUs spinning forever.

Hybrid Locks (User Space):
* A practical middle ground: spin briefly (e.g., for ~1,000 cycles) in case the lock becomes free quickly; if it is still locked, make a system call to put the thread to sleep and let another task run.