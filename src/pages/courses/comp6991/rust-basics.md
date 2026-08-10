---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Rust Basics
---

# **Rust Basics**

## **Variables and Mutability**
***

```rust
let x = 5;         // immutable by default
let mut y = 5;     // explicitly mutable
y = 6;             // OK
x = 6;             // compile error!
```

* Immutability is the default, which is the inverse of most mainstream languages.
* This is deliberate - it aligns with Rust's ownership model, where the compiler needs to know precisely when and where a value can change, in order to prove safety guarantees

`let` introduces a new binding - it can also **shadow** a previous binding of the same name, even changing its type:

```rust
let x = "5";
let x: i32 = x.parse().unwrap(); // shadows the old `x`, now an i32
```

* **Shadowing** doesn't mutate the memory of the old one, and the old value's type can differ entirely.
* **Shadowing** exists to let you reuse a variable name while keeping each binding immutable, instead of forcing you to either mutate a variable or invent new names for what is conceptually "the same" value at different stages of processing.

```rust
let input = "  42  ";
let input = input.trim();        // &str -> &str (trimmed)
let input: i32 = input.parse().unwrap(); // &str -> i32
```

Without shadowing, you'd have two bad options:
* Use `mut` - but you can't, because the type changes (&str → i32), and mut only allows changing the value, never the type, of a binding.
* Invent new names - `input_trimmed`, `input_parsed`, `input_final`... which clutters the code with throwaway names that exist purely because the language wouldn't let you reuse input.

**Constants** (`const`) differ from immutable let bindings: they must:
    * Have their type annotated
    * Must be set to a value computable at compile time
    * And can never be made mutable at all (`mut` isn't allowed on `const`).
```rust
const MAX_POINTS: u32 = 100_000;
```

## **Basic Data Types**
***

Category	| Types |	Notes
-- | -- | --
Integers|	i8..i128, u8..u128, isize/usize |	Signed/unsigned, sized; isize/usize match pointer width
Floating point|	f32, f64 |	f64 is the default
Boolean	|bool	|true / false
Character|	char|	4 bytes, a Unicode scalar value (not just ASCII/byte)

Integer overflow: in debug builds Rust **panics** on overflow; in release builds it **wraps** (two's complement) by default.

Compound types
* Tuples: fixed-length, can mix types - `let t: (i32, f64, bool) = (1, 2.0, true);`, accessed via `t.0`, `t.1`, ...
```rust
let t: (i32, f64, bool) = (1, 2.0, true);
let first_element = t.0; // 1
let second_element = t.1; // 2.0
let third_element = t.2; // true
```
* Arrays: fixed-length, single type, stored on the stack
```rust
let a: [i32; 3] = [1, 2, 3];
let first_element = a[0]; // 1
let second_element = a[1]; // 2
let third_element =  a[2]; // 3
```

## **Functions**
***
```rust
fn add(x: i32, y: i32) -> i32 {
    x + y   // no semicolon = this is the return value (an expression)
}
```

The last line of a function body, if it has no semicolon, becomes the implicit return value. `return` is only needed for early returns.

## **Control Flow**
***

* `if`/`else` - condition must be `bool` (no implicit truthy/falsy conversion, unlike C or Python).
* `loop` - infinite loop, can return a value via `break value;`.
* `while` - standard conditional loop.
* `for` - for loop.

## **Ownership**
***

* Each value in Rust has a single owner (a variable).
* When the owner goes out of scope, the value is dropped (its memory freed) automatically.
* There can only be one owner at a time. Assigning or passing a heap-allocated value moves ownership rather than copying it by default.
    * This contrasts with types that implement the `Copy` trait (like integers, bool, char), which are duplicated instead of moved on assignment, because copying them is cheap.