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

   &nbsp; | Borrows (`&T`, `&mut T`) | Raw Pointers 
 --- | --- | ---
 Always valid / non null? | Yes, guaranteed by the compiler | No guarantee at all
 Aliasing rules enforced?	| Yes (borrow checker)	| No, can have multiple mutable raw pointers to the same data
Can dereference outside unsafe?	| Yes	| No, requires unsafe
Guaranteed to point to live data? |	Yes	| No, can dangle freely

Raw pointers exist specifically because they are not checked. They're the tool you reach for when you need to bypass the guarantees of the compiler temporarily, deliberately, because you (the programmer) are handling the invariant some other way the compiler can't see.

`*const T` and `*mut T` are not actually enforced by the compiler the way `&T`/`&mut T` are. The const/mut here are more like a naming convention / documentation of intent than a real guarantee.

```rust
let mut v = vec![1, 2, 3];
let p1 = v.as_mut_ptr();
let p2 = v.as_mut_ptr();
// p1 and p2 alias each other, allowed, because raw pointers aren't
// subject to the borrow checker's exclusivity rule at all
```

## **Why This Matters**
***

`unsafe` doesn't disable Rust's safety model, instead it relocates the responsibility for upholding it.

In safe Rust, the compiler proves the ownership/aliasing rules hold, before the program is allowed to compile. Inside `unsafe`, the compiler can no longer prove this for the specific operations listed above, so the programmer takes on that responsibility manually, the same way an entire C or C++ program works by default.

This is why `unsafe` code isn't "turning Rust into C" globally. It's narrowing the scope of unchecked code down to a small, explicitly marked region, while everything surrounding it remains fully checked. That containment is the actual safety benefit:
* If a bug involving memory corruption/UB shows up, you know to look inside `unsafe` blocks first (although UB can appear outside of the `unsafe` block, they are usually caused by an `unsafe` block aswell).
* Contrast with C/C++, where every line of the program carries this burden implicitly, with no marker distinguishing "carefully reasoned-about pointer arithmetic" from "ordinary code."

## **Building Safe Abstractions**
***

A very common and important pattern: use `unsafe` internally, but expose a safe public API that upholds the invariants `unsafe` needs, so callers never need `unsafe` themselves and can't misuse it.

This is exactly how `Vec<T>` itself is implemented in the standard library. 
* It manipulates raw pointers and manual memory allocation (`unsafe`)
* Its public methods (`push`, `get`, indexing, iteration) are all **completely safe to call**
    * The implementer has manually verified the invariants that make the internal unsafe usage sound.
```rust
pub fn get(&self, index: usize) -> Option<&T> {
    if index < self.len {
        // SAFETY: index is checked to be within bounds above
        Some(unsafe { &*self.ptr.add(index) })
    } else {
        None
    }
}
```

`unsafe` is a tool for library/abstraction authors to build new safe primitives that the borrow checker alone couldn't construct 

If you find yourself wanting `unsafe` in ordinary application logic, it's usually worth first asking whether an existing safe abstraction (`Rc`, `RefCell`, `Vec`, etc.) already solves the problem.

A `// SAFETY:` comment convention (as above) is idiomatic. It documents why the unsafe operation is actually sound, i.e. what invariant you, the programmer, verified in place of the compiler.

## **Undefined Behavior**
***

Undefined behaviour (UB) is a concept where the official rules of a language do not say what must happen when a specific action is run. If you do it, the program can crash, give wrong answers, or even seem to work fine today and break tomorrow.

Unlike safe Rust, incorrect `unsafe` code can cause real undefined behavior, the same bugs C/C++ are prone to:
* Dereferencing a dangling or null raw pointer.
* Creating two `&mut T` references to the same data (violating aliasing rules) via raw pointer tricks.
* Reading uninitialized memory.
* Data races from unsynchronized shared mutable access.

The compiler does not catch these inside `unsafe` blocks - that's precisely the trust being extended to the programmer. This is why unsafe code demands more careful manual reasoning.

## **Common Uses of unsafe**
***

* FFI (Foreign Function Interface): calling C libraries, which know nothing about Rust's ownership rules:
```rust
extern "C" {
    fn abs(input: i32) -> i32;
}

unsafe {
    println!("{}", abs(-3));
}
```
* Implementing low-level data structures where the true safety invariant exists but isn't expressible to the borrow checker (custom allocators, intrusive linked lists, lock-free structures).
* Performance-critical code that needs to skip bounds checks after already proving safety through other means (rare, and should be benchmarked/justified).
* Interfacing with hardware / OS syscalls directly.