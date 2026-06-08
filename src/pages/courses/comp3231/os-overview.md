---
layout: ../../../layouts/Layout.astro
title: COMP3231 - Operating Systems Overview
---

## **The Role of an Operating System**
***

### **As an Abstract Machine**
***
* Extends the basic hardware with added functionality
* Provides high-level abstractions
* It hides the details of the hardware

### **As a Resource Manager**
***
* Responsible for allocating resources to users and processes
* Must ensure
    * No starvation
    * Progress
    * Allocation is according to some desired policy
    * Overall, that the system is efficiently used

## **Kernel**
***

* The portion of the operating system that is running in *privileged* mode
* Contains fundamental functionality
    * Whatever is required to implement other services
    * Whatever is required to provide security
* Contains most-frequently used functions
* Also called nucleus or supervisor