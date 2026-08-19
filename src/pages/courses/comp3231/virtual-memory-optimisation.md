---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Virtual Memory Optimisation
---

## **Demand Paging**
***

Only the parts of a program currently needed are loaded into physical memory; unused pages remain on disk and are brought in only when referenced.

Accessing a non-resident page triggers a page fault. The CPU blocks the faulting process, schedules another runnable process, and initiates disk I/O to fetch the missing page.

If physical memory is full, an existing resident page must be evicted ("replaced"). Unmodified ("clean") pages can simply be discarded, while modified ("dirty") pages must be written back to disk, which is tracked via the page table dirty bit.

A TLB miss incurs a few microseconds of latency, whereas a page fault requires several milliseconds due to disk I/O.

## **Principle of Locality**
***

Demand paging is effective because programs exhibit the Principle of Locality (often described by the 90/10 rule: 90% of execution time is spent in 10% of code):
* Temporal Locality: Recently accessed instructions or data are likely to be accessed again soon.
* Spatial Locality: Addresses near recently accessed data are likely to be referenced close together in time

## **Working Set Model**
***

Working Set ($\Delta$): The specific set of pages a process references during a moving time window $\Delta$.

The system aims to keep a process's working set in RAM to prevent frequent faulting, as working sets typically evolve gradually over time.

## **Thrashing**
***

Cause: When the degree of multiprogramming is too high, available physical memory becomes insufficient to hold the working sets of all running processes ($\sum \text{working sets} > \text{total RAM}$).

The page fault rate surges, processes spend most of their time waiting for disk I/O rather than executing, and CPU utilization sharply plummets.

Recovery: The OS suspends several processes, migrating their pages to disk to free up frames for remaining tasks, and resumes them once memory pressure subsides.

## **VM Management Policies**
***

Operation and performance of VM system is dependent on a number of policies

### **Page Size**
***

Increasing page size

Pros:
* Decreases number of pages, reduces size of page tables
* Increases TLB coverage, reduces number of TLB misses
* Increases swapping I/O throughput (Small I/O are dominated by seek/rotation delays)

Cons:
* Increases internal fragmentation
* Increases time taken for page faults. Need to read more from the disk before restarting process

While multiple page sizes offer flexibility, they add kernel complexity.

### **Fetch Policy**
***

Determines when a page should be brought into memory
* Demand paging only loads pages in response to page faults
* Pre-paging brings in more pages than needed at the moment
    * Prefetching extra pages while disk is idle
    * Wastes I/O bandwidth if pre-fetched pages aren’t used
    * Hard to get right in practice

### **Replacement Policies**
***

When memory is full, the OS selects a non-pinned victim frame to evict:
* Optimal: Evicts the page not needed for the longest time in the future. Serves as an unrealizable theoretical benchmark.
* FIFO: Evicts the oldest loaded page, ignoring usage patterns.
* LRU: Evicts the least recently accessed page. Implementation requires a time stamp to be kept for each page, updated on every reference. Highly effective but too expensive to implement exactly in software.
* Clock / Second Chance: A practical LRU approximation using a circular buffer and a reference bit:
    * Scans frames: if reference bit $= 1$, clears it to $0$ and advances; if reference bit $= 0$, selects it as the victim.
    * Supported either via hardware reference bits or simulated via page faults by invalidating valid bits.

Algorithm Ranking: $\text{Optimal} > \text{LRU} > \text{Clock} > \text{FIFO}$.

### **Resident Set Size**
***

How many frames should each process have?
* Fixed Allocation: Assigns a predetermined, static number of page frames to a process for its entire execution.
    * Pros: Isolates memory usage among processes so one process cannot starve another.
    * Cons: Suboptimal memory utilization - some processes suffer high fault rates due to under-allocation, while others waste unused allocated frames.
* Variable Allocation: The number of frames assigned to a process dynamically changes over its lifetime based on its actual memory demands and working set shifts.

Replacement Scope Under Variable Allocation:
* Global Scope:
    * The OS maintains a global pool of free frames.
    * When a page fault occurs, an available free frame is allocated; if none are free, a victim frame is chosen from any process in the system.
    * Pros/Cons: Easiest to implement and automatically balances memory load across the system, but cannot provide strict performance guarantees for high-priority tasks.
* Local Scope
    * Initial frames are allocated based on process type, program requests, or priority.
    * When a page fault occurs, the process must evict a victim from its own resident set.
    * Frame allocations are periodically re-evaluated and adjusted system-wide.

**Page-Fault Frequency (PFF) Scheme**

A dynamic strategy used to regulate resident set size based on observed page fault rates:
* Establishes an upper bound and a lower bound for acceptable fault rates.
* Above Upper Bound: If a process faults too frequently (indicating its working set is not fully resident), the OS increases its frame allocation.
* Below Lower Bound: If a process rarely faults (indicating over-allocation), the OS reclaims and decreases its allocated frames.

### **Cleaning Policy**
***

Clean pages are much cheaper to replace than dirty pages

Demand cleaning
* A page is written out only when it has been selected for replacement
* High latency between the decision to replace and availability of free frame.

Precleaning
* Pages are written out in batches (in the background, the pagedaemon)
* Increases likelihood of replacing clean frames
* Overlap I/O with current activity
