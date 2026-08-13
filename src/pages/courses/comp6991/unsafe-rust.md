---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Unsafe Rust
---

# **Unsafe Rust**

## **Why Unsafe Rust Exists**
***

Everything so far has been **safe Rust**, the subset of the language where the compiler statically enforces ownership, borrowing, and type rules, guaranteeing **no undefined behavior**. But some things are genuinely impossible to express while satisfying the borrow checker, even when they're actually correct:
* Talking to hardware, the OS, or C libraries (none of which know about Rust's rules).
* Building certain low-level data structures (e.g. a doubly-linked list, some allocators) where the true aliasing pattern is safe, but not provable by the borrow checker's conservative analysis
* Implementing the safe abstractions (Vec, Box, Rc, etc.) themselves. Something has to sit underneath the safe standard library and actually manage raw memory.

`unsafe` is Rust's way for these cases. Critically, it **does not turn off the borrow checker or type checker**.

## **Unsafe Powers**
***

Inside an `unsafe` block, you gain access to exactly five extra abilities:
1. Dereference a raw pointer (`*const T` / `*mut T`)
2. Call an `unsafe fn` or an `unsafe` method.
3. Access or modify a mutable static variable.
4. Implement an `unsafe trait`.
5. Access fields of a `union`

## **Raw Pointers**
***

These are C-style pointers, distinct from Rust's borrows (`&T` / `&mut T`):

Raw pointers exist specifically because they are not checked. They're the tool you reach for when you need to bypass the guarantees of the compiler temporarily, deliberately, because you (the programmer) are handling the invariant some other way the compiler can't see.