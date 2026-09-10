---
layout: /src/layouts/Layout.astro
title: COMP3231 - Virtualisation
---

## **Virtualisation**
***

A virtual system $X$ is defined as a system $Y$ that is physically different from $X$, but simulates its behavior for specific purposes. Instead of running on bare metal, software interacts with an abstraction layer that mimics the interface of a dedicated machine or environment.

Everyday Examples:
* Virtual memory
* Virtual machine
* Virtual terminal

Virtualisation commonly follows a three-stage lifecycle:
1. Yesterday's system
    * Begins as physical, dedicated hardware designed for a specific workload or architecture.
2. Today’s compatibility trick
    * As technology moves forward, newer hardware renders the old architecture obsolete, but existing software rely heavily on the legacy environment.
    * Engineers introduce an virtualization layer, a "trick" to run old software on modern systems without modification.
3. Tomorrow’s interface
    * Over time, the software layer completely displaces the physical hardware it originally copied
    * The emulation layer stops being a temporary bridge and becomes the standardized, first-class interface that all new systems and applications target.

## **The Two-Stage Memory Model**
***

In a standard OS, translation converts Virtual Address (VA) directly to Physical Address (PA).

In a virtualized system, memory translation is split into two distinct stages:
1. **Guest OS control**: Converts Guest Virtual Address (VA) to Guest Physical Address, also called Intermediate Physical Address (IPA). The guest OS manages this stage believing it owns physical RAM.
2. **Hypervisor control**: Converts the Intermediate Physical Address (IPA) to the actual machine Physical Address (PA) in physical RAM. 

The cost of two-dimensional page walks: to resolve a single step in the guest's page table (VA $\rightarrow$ IPA), the hardware must perform an entire translation through the hypervisor's page tables (IPA $\rightarrow$ PA).

With standard multi-level page tables (e.g., 4 levels deep) at typical 4K frames, resolving a single memory reference can require up to $(4 + 1) \times (4 + 1) - 1 = 24$ memory accesses in worst-case TLB misses.

**Mitigation via Large Mappings:**

We can collapse intermediate translation levels using large pages / superpages (e.g., a 1G frame at the IPA $\rightarrow$ PA stage).

By backing entire guest address spaces with large contiguous frames at the hypervisor level, the hardware eliminates lower translation tiers, drastically cutting TLB misses and memory walk overhead.

## **Hypervisor Support**
***

Just as a traditional operating system acts as the **supervisor** over regular user programs, modern virtualization introduces a "super-supervisor" - the **hypervisor** (or Virtual Machine Monitor) to manage multiple operating systems.

Modern CPU architectures provide native support by expanding traditional CPU structures:
* Additional Page Tables
* Additional Exception Levels
    * EL0 - EL3 replace User/Kernel
* Additional Exception/Interrupt Entry Paths
    * VMEnter: activate a VM system
    * VMExit: exception back to hypervisor level