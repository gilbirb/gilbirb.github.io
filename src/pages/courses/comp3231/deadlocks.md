---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Deadlocks
---

## **Deadlocks**
***

Formal definition:

"*A set of processes is deadlocked if each process in the set is waiting for an event that only another process in the set can cause.*"

A deadlock is a state where a set of processes is permanently blocked because each process is waiting for an event (typically the release of a resource) that can only be triggered by another process in that same set. As a result, none of the involved processes can run, make progress, or release their held resources.

## **Four Conditions for Deadlock**
***
For a deadlock to occur, all four of the following conditions must hold simultaneously:

1. Mutual Exclusion
    * Resources cannot be shared; only one process can hold a resource at any given time.
2. Hold and Wait (Hold While Waiting): 
    * A process is currently holding at least one resource while actively requesting and waiting for additional resources held by other processes.
3. No Preemption (Non-preemptable Resources):
    * Resources cannot be forcibly taken from a process; they must be released voluntarily by the process holding them after completing its task.
4. Circular Wait: 
    * A closed chain of two or more processes exists, where each process is waiting for a resource held by the next process in the cycle (e.g., Process A waits for a resource held by Process B, which in turn waits for a resource held by Process A).

**How Deadlocks Occur in Practice**

When multiple processes compete for exclusive, non-preemptable resources (such as mutex locks) and acquire them in an inconsistent order, a circular dependency forms. Once all four conditions are met, the system enters a deadlock that cannot resolve on its own without external intervention or specific operating system mitigation strategies.

## **Livelock**
***

Livelock is a condition where two or more processes continuously change their state in response to each other, but none makes any actual forward progress. Unlike deadlock, the processes are actively running rather than blocked.

Code Example Scenario:
* Process A acquires `lock_1`, attempts try_lock(`lock_2`), fails, releases `lock_1`, waits a fixed time, and retries.
* Process B acquires `lock_2`, attempts try_lock(`lock_1`), fails, releases `lock_2`, waits the exact same fixed time, and retries.
* Both continuously execute instructions and switch states, yet neither ever executes the critical section.

## **Strategies for dealing with Deadlocks**
***

### Ignore the problem altogether - The "Ostrich" Algorithm.

Pretend deadlocks do not exist and take no action. This is a pragmatic engineering tradeoff used by systems like UNIX and Windows when deadlocks occur rarely and prevention costs are high.

<img src="/assets/images/comp3231/ostrich.png" alt="" width="50%" style="display:block;margin:1rem auto;"/>

### Deadlock Prevention
Establish structural allocation rules to systematically negate at least one of the four necessary conditions (Mutual Exclusion, Hold and Wait, No Preemption, or Circular Wait).

* Attacking Mutual Exclusion: 
    * Let multiple processes share the resource at the exact same time. This is not feasible for most things because hardware (like printers) and data (like database write locks) simply cannot be shared safely without causing errors.
* Attacking Hold and Wait:
    * Make every process ask for all its needed resources right at the start.
    * Advantage: A process never waits around while already holding onto a resource.
    * Drawbacks: A program often doesn't know what it needs in advance, and holding resources early wastes them for other jobs.
    * Variation: A process gives up all its current resources before asking for more, but this can lead to livelock.
* Attacking No Preemption: 
    * Forcibly take away a held resource if a process can't immediately get the next one it needs. This is not practical for non-preemptable resources - snatching a printer away mid-page ruins the entire print job.
* Attacking Circular Wait (Resource Ordering): 
    * Number all resources and force processes to grab them in strictly ascending order.
    * If a process needs resource 1, it must grab it before grabbing resource 2.
    * This completely stops cycles from forming, making it the most practical and common method used in real systems.

### Deadlock Detection and Recovery

Allow deadlocks to happen, periodically run algorithms to detect resource allocation cycles, and recover by preempting resources or terminating involved processes.

### Deadlock Avoidance

Dynamically examine resource allocation state in real time (e.g., using the Banker's Algorithm) to ensure the system only transitions into guaranteed "safe states".

## **Starvation**
***

Starvation happens when a process waits indefinitely for a resource that repeatedly becomes free, but the system keeps allocating it to other waiting processes.

The resource is available over and over, but the waiting process is continuously skipped over by the scheduling policy.

Example (Shortest Job First):
* A system allocates a resource to the shortest job first to minimize average waiting time.
* If a stream of short jobs keeps arriving, a long job will sit in the queue and wait indefinitely, even though it is ready to run.

Solution: Use a First-Come, First-Served (FCFS) policy so requests are served strictly in arrival order.