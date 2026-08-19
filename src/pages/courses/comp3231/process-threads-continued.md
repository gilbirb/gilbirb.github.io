---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Process & Threads Continued
---

### **Simple Process**
***

Minimally consists of three segments
* Text: Contains the code (instructions)
* Data: Global variables
* Stack: Activation records of procedure/function/method and local variables

Note:
* Data/heap can dynamically grow up
* The stack can dynamically grow down

<img src="/assets/images/comp3231/process-memory-layout.png" alt="" width="30%" style="display:block;margin:1rem auto;"/>

### **Multi-Threaded Process**
***

Initially consists of some segments
* Text: initial code
* Data: initial global variables

Heap grows dynamically and shared by the threads

New regions are added dynamically
* Thread stacks
* Memory-mapped files

Regions may be sparse
* Address space is large: 2^32 bytes or more
* Regions of address space may be reserved but no actual contents or memory allocated

<img src="/assets/images/comp3231/multithreaded-process-memory-layout.png" alt="" width="30%" style="display:block;margin:1rem auto;"/>

### **OS With Processes (but not threads)**
***

User-mode
* Processes (programs) scheduled by the kernel
* Isolated from each other
* No concurrency issues between each other

System-calls transition into and return from the kernel

Kernel-mode
* Nearly all activities still associated with a process
* Kernel memory shared between all processes
* Concurrency issues may exist between processes concurrently executing in a system call
    * If system calls can be interrupted/preempted, access to kernel objects must by synchronized.
    * If system calls cannot be interrupted, they delay switches, and worst-case execution time of system calls is important.

### **User-Level Threads**
***

Implemented entirely at user-level
* User-level Thread Control Block (TCB), ready queue, blocked queue, and dispatcher
* Kernel has no knowledge of the threads (it only sees a single process).
* Thread management (create, exit, yield, wait) are implemented in a runtime support library.
* Threads can yield to other threads by calling the library.
* If a thread blocks waiting for a resource (e.g. mutex) held by another
thread inside the same process, its state is saved and the dispatcher
switches to another ready thread.

Pros
* Thread management and switching at user level is much faster than doing it in kernel level
    * No need to trap (take syscall exception) into kernel and back to switch
* Dispatcher algorithm can be tuned to the application
    * E.g. use priorities
* Can be implemented on any OS (thread or non-thread aware)
* Can easily support massive numbers of threads on a per-application basis
    * Use normal application virtual memory
    * Kernel memory more constrained. Difficult to efficiently support wildly differing numbers of threads for different applications.

Cons
* Threads have to yield() manually (no timer interrupt delivery to userlevel)
    * Co-operative multithreading: A single poorly design/implemented thread can monopolise the available CPU time
* Does not take advantage of multiple CPUs (in reality, we still have a single threaded process as far as the kernel is concerned)
* If a thread makes a blocking system call (or takes a page fault), the process (and all the internal threads) blocks
    * Can’t use these threads to overlap I/O with computation

Hybrids and Workarounds
* User-level threads can be partly integrated with the kernel
* e.g. Timer signals can permit a kind of pre-emptive multithreading.

### **Kernel-provided Threads**
***

Also called kernel-level threads (Even though they provide threads to applications)

Threads are implemented by the kernel
* TCBs are stored in the kernel
    * A subset of information in a traditional PCB (The TCB is basically the old PCB, but shrunk down to only the execution-context fields)
        * The subset related to execution context (the part that needs to be separate per thread)
    * TCBs have a PCB associated with them
        * Each TCB (thread) keeps a pointer to its PCB, because the PCB is where the process's shared resources live - the stuff that belongs to the group of threads collectively, not to any individual thread
    * Thread management calls are implemented as system calls
        * E.g. create, wait, exit

Pros
* Preemptive multithreading
    * The kernel knows about each individual thread as a real schedulable entity. The kernel enforces fair-ish scheduling automatically
* Parallelism
    * Can overlap blocking I/O with computation
    * Can take advantage of a multiprocessor

Cons
* Thread creation and destruction, and blocking and unblocking threads requires kernel entry and exit.
    * More expensive than user-level equivalent

## **Context Switch**
***

A context switch is the mechanism used by the operating system to save the execution state of the currently running process or thread and restore the state of a target process or thread so that execution can resume transparently without loss of data.

When a Context Switch Occurs:
* System calls: Mandatory if the system call blocks (e.g., waiting for I/O) or on exit().
* Exceptions: Mandatory if an error occurs and the process cannot continue.
* Interrupts: Triggered by hardware events, primarily the timer interrupt to implement preemptive multitasking.

Step-by-Step Context Switch Mechanism (Kernel-Level / OS/161):
1. **Enter Kernel Mode**: The CPU takes an interrupt, system call, or exception, switching the Stack Pointer (`SP`) from the user stack to the thread's kernel stack.
2. **Push Trapframe**: The OS pushes a trapframe (user-level context, including user-level `PC` and `SP`) onto the kernel stack.
3. **Run C Kernel Code**: C kernel handlers run to process the event, building up a C activation stack.
4. **Initiate Thread Switch**: The scheduler decides to switch execution and calls `thread_switch()`, which selects the next thread from the run queue.
5. **Save Callee-Saved Registers (`switchframe`)**: Inside `switchframe_switch`, the kernel pushes the registers required by the C calling convention onto the current kernel stack (`s0–s6`, `s8`/`fp`, `gp`, `ra`, 40 bytes total on MIPS).
6. **Swap Stack Pointers**: The current kernel stack pointer (`sp`) is saved into the old thread's control block (`a0`), and the new thread's saved `sp` is loaded from `a1`.
7. **Restore Context**: The new thread’s registers are popped from its kernel stack, and execution returns via `j ra`.
8. **Return to User Mode**: The new thread unwinds its C activation stack, restores the user-mode trapframe, and returns to user space with its restored user `PC` and `SP`.