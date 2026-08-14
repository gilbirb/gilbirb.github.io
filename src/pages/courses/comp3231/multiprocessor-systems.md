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