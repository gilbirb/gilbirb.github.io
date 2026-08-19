---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Virtual Memory
---

## **Virtual Memory**
***

Virtual memory separates the programmer's logical view of memory from actual physical RAM, allowing a process's data to be scattered non-contiguously across physical frames.

There are two classic variants of virtual memory: **Paging** and **Segmentation**. In this course we will focus on paging.

Virtual address space is divided into fixed-size chunks called **pages**; physical RAM is divided into equal-sized chunks called **frames**.

**Page table** is a data structure maintained by the OS for each process that logically maps virtual pages to physical frames.

**MMU (Memory Management Unit)**: Hardware between the CPU and memory bus that translates virtual addresses into physical addresses at runtime using the page table.

A **virtual address** consists of a **page number** (mapped to a frame) and an **offset** (kept identical in physical memory).

Goal:
* **Eliminates External Fragmentation**: Memory does not need to be physically contiguous, so any free frame can be allocated.
* **Minimizes Internal Fragmentation**: Space is only wasted on the last partially filled page of an allocation.
* **Protection & Sharing**: Processes are isolated in their own address spaces, yet can share code/data by mapping distinct virtual pages to the identical physical frame.
* **Abstraction**: The programmer only deals with uniform virtual addresses; hardware and the OS hide the non-contiguous physical frame layout.

### **Page Faults**
***

If the CPU references an address not present in RAM or without valid permissions, it triggers an exception (page fault).

Two types:
* **Illegal Access**: Triggers a protection error (terminating or signaling the process).
* **Non-Resident Page**: The OS allocates an empty frame, loads the missing page from disk, updates the page table, and restarts the instruction.

### **Page Tables & Address Translation**
***

Every memory access (instruction fetch, load, or store) translates a virtual address to a physical address via the MMU. The virtual address is split into a Virtual Page Number (VPN) and an Offset. The MMU looks up the VPN in the page table to get the Physical Frame Number (PFN) and preserves the offset.

**Page Table Structure**: Logically an array indexed by VPN where each Page Table Entry (PTE) stores the matching frame number alongside control attributes:
* Present/Absent (Valid): Marks whether the page resides in physical RAM.
* Protection: Read, Write, and Execute permissions.
* Modified (Dirty): Tracks if the page has been written to.
* Referenced: Tracks if the page was recently accessed.
* Caching Disabled: Bypasses CPU cache (used for memory-mapped device I/O).

<img src="/assets/images/comp3231/pte.png" alt="" width="75%" style="display:block;margin:1rem auto;"/>


The Problem: A flat page table for a 32-bit (or 64-bit) address space requires millions (or billions) of entries per process, which consumes excessive RAM.

### **Multi-Level Page Tables**
***

Organizes page tables into a tree structure (e.g., Two-Level or 4-Level on x86-64).

Unused address regions simply hold `NULL` pointers at higher levels, allowing memory to only be allocated for active regions (sparsity).

<img src="/assets/images/comp3231/2l-pt.png" alt="" width="75%" style="display:block;margin:1rem auto;"/>


### **Inverted & Hashed Page Tables***
***

As address spaces grow (especially in 64-bit architectures), normal multi-level page tables **take up too much memory** because they scale with the size of the virtual address space.

Virtual address space is typically massive, but physical RAM is much smaller. Instead of mapping every virtual page, an Inverted Page Table (IPT) maps from Frame $\rightarrow$ Page (an array indexed directly by physical frame number).

#### Inverted Page Table (IPT)

Exactly one entry per physical frame; its size scales with physical RAM, not virtual address space.

Only one global table is needed for the entire system instead of per-process page tables.

Requires a separate secondary data structure for non-resident pages.

Lookup Mechanism:
* Virtual address provides `(PID, VPN, offset)`.
* Computes a `Hash(PID, VPN)` to index into a Hash Anchor Table (HAT).
* Chains through IPT entries matching `PID` and `VPN`.
* Match: The array index of the matching entry becomes the Physical Frame Number (PFN).
* Chain ends in NULL: Triggers a Page Fault.

Frame sharing across processes is difficult because each frame entry only holds a single (PID, VPN) mapping.

#### Hashed Page Table (HPT)

Explicitly includes the Physical Frame Number (PFN) inside each table entry alongside `PID` and `VPN`.

Enables efficient frame sharing: multiple entries with different `PID`/`VPN` pairs can easily reference the exact same `PFN`.

### **Translation Lookaside Buffer**
***

Accessing main memory for page table lookups on every memory reference creates an intolerable performance penalty (doubling or tripling memory access times).

The **TLB** is a tiny, super-fast hardware cache located directly on the CPU chip that remembers recently used address translations.

**TLB Hit**: The CPU checks the TLB first. If the match is found, it gets the physical frame number immediately without touching RAM.

**TLB Miss**:
* The hardware or OS looks up the page in the main page table in RAM.
* **Page is in RAM**: The translation is copied into the TLB, and the CPU retries the instruction.
* **Page is on Disk**: The OS triggers a Page Fault, loads the page from disk, updates the page table, loads the TLB, and retries.

How It Gets Loaded:
* **Hardware-loaded**: The CPU automatically searches the page table and updates the TLB (e.g., x86, ARM).
* **Software-loaded**: The CPU pauses, calls an OS helper function to look up the table, and the OS fills the TLB (e.g., MIPS).


TLB and Context Switching:
* Because different programs use the same virtual address numbers, the OS must either wipe the TLB clean on a context switch or tag every entry with a process ID number (ASID) so entries do not mix up.

With a high hit rate (like 99%), memory lookups feel almost as fast as a single memory access.