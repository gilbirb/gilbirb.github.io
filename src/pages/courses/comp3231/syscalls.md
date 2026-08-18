---
layout: ../../../layouts/Layout.astro
title: COMP3231 - System Calls
---

## **System Calls**
***

A computer splits programs into two main areas: 
* User Mode for normal applications 
* Kernel Mode for the operating system.

A **system call** works like a special function call that lets a normal program safely ask the operating system to do tasks that require special permissions (like talking to hardware or managing memory). Once finished, the operating system sends the result back to the program.

Programs mainly use system calls to:
* Manage running processes
* Read or write files
* Manage directories

## **System Call Implementation**
***

### Basic CPU Working Model
***

* The CPU repeatedly reads an instruction, runs it, and points to the next one using the Program Counter (PC).
* It keeps temporary values and tracking markers in internal storage called Registers, including the Stack Pointer (SP).

### CPU Modes and Protection
***

* **User Mode**: Normal apps run here with limited access so they cannot harm the system or touch protected memory.
* **Kernel Mode (Privileged Mode)**: The operating system runs here with full access to all hardware, memory, and special instructions.

Some instructions (like turning off all hardware interrupts) are unsafe; letting regular apps run them could freeze the whole computer.

### System Call Transition
***

* A special CPU instruction triggers a switch from **User Mode** to **Kernel Mode** and jumps to a specific handler in the operating system.
* The computer saves the user's position (PC) and stack (SP), replaces them with kernel ones, and restores the original values when switching back.
* Parameters and results are passed between the program and the kernel using CPU registers based on set agreements (conventions).

A standard function call cannot change CPU permission levels or force execution to start only at authorized, secure entry points.

### Steps in Making a System Call 
***

<img src="/assets/images/comp3231/syscall-steps.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

There are 11 steps in making the system call `read(fd, buffer, nbyt)`

## **MIPS R2000/R3000**
***

### Coprocessor 0
***

* CP0 is the part of the CPU responsible for managing exceptions, interrupts, and memory.
* CP0 is manipulated using `mtc0` (move to) and `mfc0` (move from) which can only be run in kernel mode.

Key CP0 Registers:
* `c0_status`: Tracks CPU status, including whether interrupts are enabled and if the CPU is in user or kernel mode.
* `c0_cause`: Stores the reason or code (`ExcCode`) for the exception that just happened.
* `c0_epc`: The Exception Program Counter, which saves the memory address where the program should restart after the exception is handled.

### Hardware Exception Handling
***

* When an exception occurs, the CPU automatically saves the restart address into `c0_epc`.
* The hardware switches to Kernel Mode and automatically disables interrupts in `c0_status`.
* It writes the exception type into `c0_cause` and sets the Program Counter (PC) to jump directly to the kernel exception handler address (`0x80000080`).

Returning from an Exception: 
* The kernel jumps back to the saved address using `jr k1` (with the address from `c0_epc`).
* It runs `rfe` (Restore From Exception) to pop back the previous status, returning safely to user mode with interrupts turned back on.

## MIPS System Calls
***

Programs use the `syscall` instruction to cause an exception and enter the kernel.

To tell the kernel what it needs, the user program follows a strict register convention (for OS/161):
* `v0`: Holds the system call number (e.g., 5 for read).
* `a0–a3`: Hold the first four function arguments.
* On return, `a3` signals success (`0`) or failure (non-zero).
* `v0` holds the returned result on success, or the error code (`errno`) on failure.