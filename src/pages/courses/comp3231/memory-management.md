---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Memory Management
---

## **OS Memory Management**
***

The operating system acts as an administrator for physical system memory (RAM). Its core duties include:
* **Tracking Memory**: Keeping track of which regions of memory are currently allocated to processes and which remain free.
* **Allocation & Deallocation**: Assigning free memory blocks to processes upon request and reclaiming memory when processes terminate.
* **Swapping & Paging**: Managing the transfer of memory contents between RAM and external disk storage.

This management is essential due to the **Memory Hierarchy**. Because fast memory (registers, caches) is small and expensive, while large storage (disks) is slow, the OS focuses on optimizing main memory (RAM) usage to maintain system performance.

## **Monoprogramming vs. Multiprogramming**
***

Monoprogramming: The system runs only one process at a time.
Okay if:
* Only have one thing to do
* Memory available approximately equates to memory required

Otherwise,
* Leads to severe CPU underutilization while waiting for I/O operations 
* Poor utilisation of memory if we switch between jobs with different memory needs

Multiprogramming: The OS divides memory so that multiple processes can reside in RAM simultaneously. This maximizes CPU utilization by switching tasks whenever one is waiting for I/O.

## **Fixed Partitioning**
***

To improve upon Monoprogramming, operating systems aim to maximize CPU and memory utilization by subdividing memory to run multiple processes concurrently.

1. **Equal-Sized Fixed Partitions**
    * Main memory is divided into fixed, equal-sized blocks.
    * Any process smaller than or equal to the partition size can be loaded into any free partition.
    * Partitions are either free or busy
    * **Drawbacks:**
        * Internal Fragmentation: Any unused space inside an allocated partition is wasted.
        * Inability to Run Large Tasks: Processes larger than a single partition cannot run, even if total free memory across partitions is available.

2. **Fixed, Variable-Sized Partitions**
    * Divide memory at boot time into a selection of different sized partitions based on expected workloads
    * Queue Strategies:
        * **Multiple Input Queues**: Each partition size has its own queue. Processes wait in the queue for the smallest partition that fits them.
            * Issue: Some partitions may sit idle if their specific queue is empty, even if other partitions are flooded with jobs.
        * **Single Input Queue**: A single queue that searches for any job that fits an available partition.
            * Issue: Small jobs may be placed into large partitions when available, increasing internal fragmentation.

**Fixed Partition Summary**

* Pros: Very simple and easy to implement.
* Cons: Leads to poor memory utilization due to internal fragmentation.
* Historical Context & Usage: Used in early systems such as IBM System/360 (OS/MFT in 1964) and still applicable in simple embedded systems with predictable static workloads.

## **Dynamic Partitioning**
***

Dynamic Partitioning uses variable-length partitions allocated on-demand from free memory regions

A process is allocated exactly the amount of memory it requests

<img src="/assets/images/comp3231/dynamic-partition-1.png" alt="" width="90%" style="display:block;margin:1rem auto;"/>
<img src="/assets/images/comp3231/dynamic-partition-2.png" alt="" width="90%" style="display:block;margin:1rem auto;"/>

Main Issue: External Fragmentation
* Over time, as processes are created and terminated, memory becomes broken up into small, non-contiguous free blocks ("holes")
* Impact: Total free memory may be sufficient to satisfy a request, but because it isn't contiguous, a new process cannot be loaded

## **Dynamic Allocation Strategies**
***

Free memory is managed as a linked list of free memory ranges ordered by increasing address.
<img src="/assets/images/comp3231/dynamic-ll.png" alt="" width="80%" style="display:block;margin:1rem auto;"/>

The main allocation strategies are:
1. **First-Fit**: Scans from the beginning and allocates the first free block large enough.
    * Pros: Fast and preserves large contiguous blocks at the end of memory. Generally the best performer overall.
2. **Next-Fit**: Similar to First-Fit, but begins searching from the location of the last successful allocation.
    * Cons: Performs worse than First-Fit because it breaks up large free blocks at the end of memory.
3. **Best-Fit**: Searches the entire list to find the block closest in size to the request.
    * Cons: Slow (scans entire list) and leaves behind tiny, unusable memory fragments.
4. **Worst-Fit**: Searches the entire list and chooses the largest available block.
    * Cons: Slow and does not significantly reduce fragmentation.

## **Compaction**
***

External fragmentation can be reduced by shuffling processes in memory to bring all free memory together into one large block.

Requires hardware/OS support for dynamic relocation at runtime.

## **Address Binding and Relocation**
***

Dynamic partitioning raises fundamental questions about how processes run at arbitrary locations in memory and how to prevent them from interfering with each other.

1. Address Binding Times

Programs use logical addresses that must be bound to physical RAM addresses at one of three stages:
* **Compile** / Link Time: Addresses are fixed at compile time. Requires recompilation if the program moves in memory.
* **Load Time**: Compiler generates relocatable code, and the loader converts logical addresses to physical addresses as the program is loaded.
* **Run Time**: Translation from logical to physical addresses occurs dynamically during execution via hardware support.

2. Hardware Support: Base and Limit Registers

To support runtime binding and ensure memory protection, hardware relies on special registers:
* **Base Register** (Relocation Register): Stores the physical starting address of the active process. The hardware adds the base address to every logical address generated by the CPU to produce the physical address ($\text{Physical Address} = \text{Logical Address} + \text{Base}$).
* **Limit Register** (Bound Register): Stores the maximum logical address size the process is allowed to access.
* **Protection Mechanism**: Before adding the base address, the CPU checks if $\text{Logical Address} < \text{Limit}$. If it exceeds the limit, a CPU trap (addressing error) is triggered.

**Summary of Base and Limit Registers**

Pros: Supports protected multi-tasking and dynamic relocation.

Cons: Process memory must still be contiguous, which leads to external fragmentation issues. It also makes sharing address spaces between processes difficult.

## **Timesharing**
***

As computing evolved beyond batch processing to interactive timesharing systems, memory management needed to support a mix of active and long-lived processes with varying lifetimes and input demands.

Goal: Support multiple active users and long-running interactive tasks concurrently.

Challenge: Systems have more active or waiting processes than can simultaneously fit into physical RAM.

## **Swapping**
***

A process can be swapped temporarily out of memory to a backing store, and then brought back into memory for continued execution.

Swapping involves transferring the whole process

Backing store:  fast disk large enough to accommodate copies of all memory images for all users; must provide direct access to these memory images.

Can prioritize: lower-priority process is swapped out so higher priority process can be loaded and executed.

Major part of swap time is transfer time; total transfer time is directly proportional to the amount of memory swapped.

Mechanism:
* Swap Out: A process that is inactive or lower priority is written entirely to a dedicated high-speed backing store (disk space).
* Swap In: A swapped-out process is loaded back into RAM when it is ready to run or gains priority.

Key Limitation:
* Performance Overhead: Moving an entire process image back and forth over the storage bus introduces significant transfer delay, making full-process swapping inherently slow.

<img src="/assets/images/comp3231/swapping.png" alt="" width="80%" style="display:block;margin:1rem auto;"/>
