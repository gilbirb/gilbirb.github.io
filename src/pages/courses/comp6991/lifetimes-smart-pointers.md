---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Lifetimes & Smart Pointers
---

# **Ownership & Borrowing**

## **Why Lifetimes Exist**
***

Every borrow must be valid for as long as it's used. The borrow checker rejects dangling references. For simple cases (one function, one obvious scope), the compiler can figure this out on its own. But when borrows flow through functions, passed in, possibly returned out, the compiler sometimes can't tell, just from the code, which input a returned borrow's validity actually depends on.

**Lifetimes** are how you tell the compiler that. They're not a runtime concept and add zero runtime cost. They exist purely to give the borrow checker enough information to prove borrows never outlive the data they point to.

```rust
fn longest(x: &str, y: &str) -> &str {   // COMPILE ERROR
    if x.len() > y.len() { x } else { y }
}
```

This fails to compile because the compiler cannot know, just by reading the signature, whether the returned borrow will be tied to x's validity or y's. Both are possible depending on which branch runs. Without more information, the compiler must reject it, since it can't prove the returned reference won't dangle.

## **Lifetime Annotations**
***

The fix: annotate the relationship between the input and output reference lifetimes explicitly.
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```
Simplest way to read `'a` here: **`'a` is whichever of `x` and `y` has the shorter lifetime**. 

Lifetime annotations don't change how long any value actually lives. They don't extend or shorten anything at runtime. They are purely a way of describing an existing relationship between reference lifetimes so the borrow checker has enough information to verify it.

**What this catches:**
```rust
let s1 = String::from("long string");
let result;
{
    let s2 = String::from("short");
    result = longest(s1.as_str(), s2.as_str());
} // s2 dropped here
println!("{result}"); // COMPILE ERROR: result may reference s2, which is gone
```

Because the signature says the return value's validity is tied to both inputs, the compiler correctly refuses to let `result` outlive `s2`

## **Lifetime Elision**
***

Most of the time, you don't write lifetimes explicitly. The compiler infers them via a fixed set of rules called lifetime elision:
1. Each elided input reference gets its own lifetime parameter.
2. If there's exactly one input lifetime, it's assigned to all elided output lifetimes.
3. If one parameter is `&self``/&mut self` (a method), the lifetime of `self` is assigned to all elided output lifetimes.

```rust
fn first_word(s: &str) -> &str { ... }
// desugars to:
fn first_word<'a>(s: &'a str) -> &'a str { ... }
```
You only need to annotate lifetimes explicitly when there's genuine ambiguity the elision rules can't resolve

## **Structs Holding References**
***

A struct that stores a reference must also be annotated with a lifetime, so the compiler knows the struct instance can't outlive the data it borrows:

```rust
struct Excerpt<'a> {
    part: &'a str,
}

let novel = String::from("Call me Ishmael. Some years ago...");
let first_sentence = novel.split('.').next().unwrap();
let e = Excerpt { part: first_sentence }; // e cannot outlive `novel`
```

This is the same underlying rule as function lifetimes. It just applies to data structures instead of function signatures.

## **The 'static lifetime**
***

`'static` means a reference is valid for the entire duration of the program - e.g. string literals (`&'static str`), which are embedded directly in the compiled binary and never freed.
```rust
let s: &'static str = "I live forever";
```

It's occasionally overused as a lazy fix for lifetime errors - but forcing something to `'static` when it isn't naturally so (e.g. via Box::leak) usually means leaking memory. Should be reached for deliberately, not as a generic escape hatch.

## **Smart Pointers**
***

A smart pointer is a data structure that acts like a pointer but carries additional metadata/behavior - most notably, owning the data it points to and handling cleanup automatically (RAII). This is where Rust represents things the ownership/borrowing model alone can't: shared ownership, heap allocation of unsized/recursive data, and interior mutability.

| Type | Purpose | Analogous to (C++) |
| -- | -- | -- |
| `Box<T>` | Single ownership, heap allocation | `unique_ptr` |
| `Rc<T>` | Multiple ownership (single threaded), reference counted | `shared_ptr` (single threaded) |
| `Arc<T>` | Multiple ownership (thread-safe), atomically reference counted | `shared_ptr` (thread safe) |
| `RefCell<T>` | Interior mutability, borrow rules checked at runtime instead of compile time | N/A (no direct C++ equivalent) |

## **Box\<T>**
***

`Box<T>` puts a value on the heap instead of the stack, while still following normal single-ownership rules.

Recursive types have, in principle, infinite size unless indirection breaks the cycle. The compiler must know a type's size at compile time, and a struct containing itself directly would be infinitely large:

```rust
enum List {
    Cons(i32, List),  // COMPILE ERROR: infinite size
    Nil,
}
```

```rust
enum List {
    Cons(i32, Box<List>), // Box has a known, fixed size (a pointer)
    Nil,
}
```

A `Box<List>` is just a pointer (fixed size, e.g. 8 bytes on 64-bit), regardless of how large the List it points to eventually becomes - this breaks the infinite-size problem.

## **Rc\<T>**
***

Sometimes multiple parts of a program genuinely need to share ownership of the same data, with none of them being the sole "responsible" owner.

`Rc<T> `("Reference Counted") allows this by tracking, at runtime, how many owners currently exist:

```rust
use std::rc::Rc;

let a = Rc::new(String::from("shared"));
let b = Rc::clone(&a); // increments the reference count, NOT a deep copy
let c = a.clone();     // same thing

println!("count = {}", Rc::strong_count(&a)); // 3
```
* `Rc::clone` is cheap - it just increments a counter
* The underlying data is only dropped once the reference count reaches zero
* `Rc<T>` only allows immutable access (`&T`) by default - it does not by itself allow mutation, because multiple owners existing simultaneously conflicts with the borrow checker's exclusivity rule for `&mut T`
* Not thread-safe - the reference count itself is a plain, non-atomic integer

## **Arc\<T>**
***

Identical API and purpose to `Rc<T>`, but uses atomic operations to update the reference count, making it safe to share across threads at the cost of slightly higher overhead due to atomic instructions vs. plain integer increments.
```rust
use std::sync::Arc;
let a = Arc::new(String::from("shared across threads"));
```

Rule of thumb: use `Rc<T>` in single-threaded code, `Arc<T>` when the data needs to cross thread boundaries.

## **RefCell\<T>**
***

Every rule so far has been enforced by the borrow checker at compile time. `RefCell<T>` moves that same rule (many readers XOR one writer) to runtime instead. It allows you to mutate data even through what looks like an immutable reference, by checking borrow rules dynamically.
```rust
use std::cell::RefCell;

let cell = RefCell::new(5);

let r1 = cell.borrow();      // like &T, checked at runtime
let r2 = cell.borrow_mut();  // PANICS at runtime: already borrowed as immutable
```
* `.borrow()` returns a `Ref<T>` (like `&T`), `.borrow_mut()` returns a `RefMut<T>` (like `&mut T`).
* If the runtime check finds a rule violation (e.g. a mutable borrow while an immutable one is still active), it **panics**, rather than the compiler catching it beforehand.

**Why would you want compile-time checks to become runtime checks? That sounds worse.**
* The borrow checker is strict. It sometimes rejects patterns that are actually safe at runtime but that it can't prove statically (e.g. mutation patterns depending on runtime conditions the compiler can't model).

Rust's default is compile-time safety, but where that's genuinely too restrictive for a legitimate pattern, the language provides an explicit, clearly-marked way to shift the check to runtime (RefCell) - rather than removing the check altogether (as raw pointers would).