---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Metaprogramming & Macros
---

# **Metaprogramming & Macros**

## **Metaprogramming**
***

Metaprogramming is writing code that writes/generates other code. Rust's main tool for this is macros.

It's worth first placing macros against something we've already used a lot: `#[derive(...)]`.

`#[derive(Debug, Clone, PartialEq)]` is itself a form of metaprogramming. It generates an `impl` block for you at compile time, rather than you writing it by hand. Macros are the general mechanism that makes things like `derive`, `println!`, and `vec!` possible.

## **Macros vs. Functions**
***

Functions and macros can look similar, but they operate at fundamentally different stages of compilation, and solve different problems.

| | Functions | Macros |
|---|---|---|
| Operates on | Values, at runtime | Code (tokens/syntax), at compile time |
| Number of arguments | Fixed (or generic, but still one call = one evaluation) | Can accept a variable number of arguments |
| Can generate new code/items? | No, a function is a single, fixed piece of code | Yes, expands into arbitrary Rust code before real compilation happens |
| Type checked | Its own signature, once | The expanded code is type-checked, per expansion |

## **Kinds of Macros**
***

| Kind | Defined with | Operates on |
|---|---|---|
| Declarative macros | `macro_rules!` | Pattern-matches token trees, substitutes into a template |
| Procedural macros | Rust functions (in a special `proc-macro` crate) taking/returning `TokenStream` | Arbitrary code that manipulates token streams programmatically |

In COMP6991 we focus on **Declarative Macros**.

## **Declarative Macros**
***

A `macro_rules!` macro is essentially pattern matching over syntax, not values. You give it one or more patterns, each with a corresponding code template to expand into.

```rust
macro_rules! square {
    ($x:expr) => {
        $x * $x
    };
}

let y = square!(5); // expands to: 5 * 5
```
* `$x:expr`: a **metavariable** (`$x`) with a **fragment specifier** (`:expr`), telling the macro system what kind of syntax is allowed to match there (an expression, in this case).
* The `=> { ... }` block is the **template**, the code the macro call is replaced with, substituting in whatever matched `$x`.

### Common fragment specifiers

| Specifier | Matches |
|---|---|
| `expr` | An expression (`1 + 2`, `foo()`, `x`) |
| `ident` | An identifier (a variable/function name) |
| `ty` | A type (`i32`, `Vec<String>`) |
| `block` | A `{ ... }` block |
| `stmt` | A statement |
| `pat` | A pattern (used in `match` arms) |
| `tt` | A single token tree, the most general, catch all specifier |

### Repetition

Matching a variable-length list of inputs:
```rust
macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $( v.push($x); )*
            v
        }
    };
}

let v = my_vec![1, 2, 3]; // expands to push 1, then 2, then 3
```

- `$( $x:expr ),*`: matches zero or more comma-separated expressions, binding each to `$x` in turn.
- `$( v.push($x); )*` in the template: repeats this line once per match captured above, substituting each in order.
- `*` means "zero or more"; `+` means "one or more"; `?` means "zero or one": same repetition semantics you'd expect from regex-like quantifiers, but operating over syntax fragments, not characters.