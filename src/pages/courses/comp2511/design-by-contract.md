---
layout: ../../../layouts/Layout.astro
title: COMP2511 - Design By Contract
---

## **Design By Contract**
***

Every software element should define a contract that governs its interaction with the rest of the software components.

A contract should address the following three questions:

* Pre-condition - what does the program expect?
    * For example, expected argument value `(marks>=0) and (marks<=100)`
* Post-condition - what does the contract guarantee?
    * For example, correct return value representing a `grade`
* Invariant - what does this contract maintain?
    * Some values must satisfy constraints, before and after the execution (say of the method).
    * For example: a value of `mark` remains between zero and 100.

A contract should be,
    * **Declarative** and must **not** include implementation details.
    * as far as possible: precise, formal, and verifiable.

## **DbC in Inheritance**
***

* An implementation or redefinition (method overriding) of an inherited method must comply with the inherited contract for the method

* Pre-conditions
    * May be **weakened** (relaxed) in a subclass
    * An implementation or redefinition may **lessen** the **obligation** of the client, but not increase it.

* Post-conditions
    * May be **strengthened** (more restricted) in a subclass
    * An implementation or redefinition (overridden method) may **increase** the **benefits** it provides to the client, but **not decrease** it.

* Invariant
    * Class invariants are inherited, that means, "the invariants of all the parents of a class apply to the class itself." 
    * A subclass can access implementation data of the parents, however, must always satisfy the invariants of all the parents - preventing invalid states!