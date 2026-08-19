---
layout: ../../../layouts/Layout.astro
title: COMP3231 - MIPS R3000
---

### **MIPS R3000**
***

MIPS R3000 uses a **load/store architecture**. There are no instructions that operate on memory except load and
store.

Simple load/stores to/from memory from/to registers:
* Store word: `sw r4, (r5)`
    * Stores content of `r4` in memory using address contained in register `r5`
*  Load word: `lw r3, (r7)`
    *  Load contents of memory into `r3` using address contained in `r7`
    * **Load delay slot:** the loaded value is not available in the destination register until one instruction later. There must always be another instruction between a load from memory and the subsequent use of the register

Arithmetic and logical operations are register to register operations

Example:
```assembly
add     r3, r2, r1  # r3 = r2 + r1

# Some other instructions:
# add, sub, and, or, xor, sll, srl
move    r2, r1      # r2 = r1

```

All instructions are encoded in 32-bit

Some instructions have *immediate* operands
* Immediate values are constants encoded in the instruction itself (Only 16-bit value)
* Examples
    * Add Immediate: `addi r2, r1, 2048 # r2 = r1 + 2048`
    * Load Immediate : `li r2, 1234 # r2 = 1234`

### **MIPS Registers**
***

User-mode accessible registers
*  32 general purpose registers
    * `r0` hardwired to zero
    * `r31` the link register for jump-and-link (JAL) instruction
* HI/LO 
    * 2 * 32-bits for multiply and divide
* PC
    * Not directly visible
    * Modified implicitly by jump and branch instructions

### **Branching and Jumping**
***

Branching and jumping have a branch delay slot
* The instruction after a branch or jump is always executed before the destination of jump

Example:
```assembly
    li  r2, 1
    sw  r0, (r3)
    j   1f
    li  r2,2    # <== Gets executed BEFORE sw r2, (r3)
    li  r2, 3
1:  sw  r2, (r3)
```
This quirky behaviour is because MIPS uses RISC architecture. 
* 5 stage pipeline, where instructions are partially through a pipeline prior to jump having an effect

<img src="/assets/images/comp3231/mips-pipeline.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

### **Jump and Link Instruction**
***

`JAL` is used to implement function calls
* `r31 = PC+8`

Return Address register (ra or r31) is used to return from function call

<img src="/assets/images/comp3231/jal.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

## **Compiler Register Conventions**
***

<img src="/assets/images/comp3231/reserved-registers-mips.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

## **Address Space Layout**
***

The 32-bit address space is partitioned into four distinct segments:
* `kuseg` (0x00000000 – 0x7FFFFFFF, 2 GB): User and kernel-accessible, TLB-translated, and 4KB-paged. Each process gets its own virtual translation.
* `kseg0` (0x80000000 – 0x9FFFFFFF, 512 MB): Kernel-only, cached, directly mapped without the TLB to physical addresses 0x00000000 – 0x1FFFFFFF (typically where kernel code/data resides).
* `kseg1` (0xA0000000 – 0xBFFFFFFF, 512 MB): Kernel-only, uncached, directly mapped to the same lower 512 MB of physical memory; used for memory-mapped I/O and boot ROM.
* `kseg2` (0xC0000000 – 0xFFFFFFFF, 1 GB): Kernel-only, TLB-translated.

<img src="/assets/images/comp3231/mips-address-space.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

## **Hardware Registers & Instructions**
***

Coprocessor 0 (CP0) Registers:
* `c0_EntryHi`: Holds the Virtual Page Number (VPN) and Address Space ID (ASID) to tag entries.
* `c0_EntryLo`: Contains the Physical Frame Number (PFN) and control bits.
* `c0_Index`: Points to a specific entry in the 64-slot TLB for reading or writing.
* `c0_EPC` (Exception Program Counter): The address/program counter of where to restart execution after the exception is handled.
* `c0_status` (Status Register): The processor status, including Kernel/User Mode bits and interrupt control/enable bits.
* `c0_cause` (Cause Register): Tracks the exception state and indicates what specific condition or event caused the exception (via the exception code).
* `c0_badvaddr` (Bad Virtual Address): The faulting virtual address that triggered the exception.

## **TLB Instructions**
***

* `TLBR`: Read entry at c0_Index into EntryHi/EntryLo.
* `TLBWI`: Write EntryHi/EntryLo to the entry indexed by c0_Index.
* `TLBWR`: Write EntryHi/EntryLo to a pseudo-random TLB entry.
* `TLBP`: Probe the TLB for a match with EntryHi and load its slot number into c0_Index.