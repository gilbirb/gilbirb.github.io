---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Processes and Threads
---

### **Processes vs Threads**
***

* Process:
    * Also called a task or job
    * A program's running instance, loaded into memory
    * "Owner" of resources allocated for program execution
    * Made up of one or more threads

* Thread:
    * Unit of execution
    * Can be traced
        * list the sequence of instructions that execute
    * Belongs to a process
        * Executes within it

### **Process and thread models of selected OSes**
***

* Single process, single thread
    * MSDOS, simple embedded system
* Single process, multiple threads
    * OS/161 as distributed
* Multiple processes, single thread per processes
    * Traditional UNIX
* Multiple processes, multiple threads
    * Modern OSs (Linux, Solaris, Mac/Darwin, Windows)

## **Process**

### **Process Creation**
***

Principal events that cause process creation
* System initialization
    * Foreground processes (interactive programs)
    * Background processes 
        * Email server, web server, print server, etc.
        * Called a *daemon* (unix) or *service* (Windows)
* Execution of a process creation system call by a running process
    * New login shell for an incoming ssh connection
* User request to create a new process
* Initiation of a batch job

### **Process Termination**
***

Conditions which terminate processes
* Normal exit (voluntary)
* Error exit (voluntary)
* Fatal error (involuntary)
* Killed by another process (involuntary)

### **Implementation of Processes**
***

* A processes' information is stored in a *process control block* (PCB)
* The PCBs form a *process* table
    * This might not actually an array or table in memory.

Example fields of a process control block (PCB)

Process management | Memory management | File management
--- | ---- | ---
Registers | Pointer to text segment | Root directory
Program counters | Pointer to data segment | Working directory
Program status word | Pointer to stack segment | File descriptors
Stack pointer | | User ID
Process state | | Group ID
Priority |
Scheduling parameters |
Process ID |
Parent process |
Process group |
Signals |
Time when process started |
CPU time used |
Children's CPU time |
Time of next alarm |

### **Process/Thread States**
***

The three possible states:
* Running - currently executing on the CPU.
* Ready - able to run, just waiting for the CPU (the scheduler hasn't picked it yet).
* Blocked - can't run even if given the CPU, because it's waiting on something (like input).

The four transitions:
1. Running -> Blocked - process needs input/data that isn't available yet, so it gives up the CPU.
2. Running -> Ready - scheduler decides another process gets a turn.
3. Ready -> Running - scheduler picks this process to run.
4. Blocked -> Ready - the thing it was waiting for (input) arrives, so it can run again.

<img src="/assets/images/comp3231/process-thread-states.png" alt="" width="40%" style="display:block;margin:1rem auto;"/>

Events That Trigger Transitions

* Running → Ready
    * Voluntary Yield()
    * End of timeslice 
* Running → Blocked
    * Waiting for input
        * File, network
    * Waiting for a timer (alarm signal)
    * Waiting for a resource to become available

### **Scheduler**
***

* Sometimes also called the *dispatcher*
* Has to choose a *Ready* process to run

**The Ready Queue**

<img src="/assets/images/comp3231/ready-queue.png" alt="" width="80%" style="display:block;margin:1rem auto;"/>

The diagram (how processes flow through the CPU):

* Enter - a process arrives and joins the Queue (this is the ready queue: all processes in the Ready state, lined up waiting for the CPU).
* Dispatch - the scheduler picks one process from the queue and hands it to the Processor (Ready → Running).
* Exit - the process finishes and leaves the system.
* Pause - the process is removed from the CPU before finishing and sent back to the queue (Running → Ready, e.g. its timeslice ended). The loop shows it'll wait for another turn.

**Managing blocked processes**
* todo because I DONT FUCKING GET IT!!!!!!!!!!!!!!??


## **Thread**

### **The Thread Model**
***

<img src="/assets/images/comp3231/thread-model.png" alt="" width="100%" style="display:block;margin:1rem auto;"/>

a. Three processes each with one thread  
b. One process with three threads  

The Thread Model – Separating execution from the environment.

Per process item | Per thread item
-- | --
Address space | Program counter
Global variables | Registers
Open files | Stack
Child processes | State
Pending alarms
Signals and signal handlers
Accounting information

* Per-process items shared by all threads in a process
* Per-thread items associated with each thread