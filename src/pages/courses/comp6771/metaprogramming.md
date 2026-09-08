---
layout: ../../../layouts/Layout.astro
title: COMP6771 - Metaprogramming
---

## **Decltype**
***

Acts as a compile-time "typeof" operator to inspect the declared type of an expression or entity without evaluating it.

```cpp
int i;
int j& = i;
decltype(i) x;   // int - variable
decltype((j)) y; // int& - lvalue
decltype(5) z;   // int - prvalue
```

Basic Rules:
* If the expression is an unparenthesized variable, static member, or function parameter, it evaluates to that entity's exact type `T`.
* If the expression is an lvalue, it yields `T&`.
* If the expression is an xvalue (an expiring value/rvalue reference), it yields `T&&`.
* If the expression is a prvalue (pure rvalue, like a literal 5), it yields `T`.

Trailing Return Types: 
* Useful with `auto ... -> decltype(...)` syntax when the return type depends on template arguments, resolving scope order issues where arguments aren't yet declared in a standard return prefix.


## **Type Transformations & Type Traits (<type_traits>)**
***

Compile-Time Inspection & Modification: Allows querying and manipulating type properties at compile time using templates.

Inspect Types: Utilities like `std::is_same<T1, T2>::value` (or `std::is_same_v<T1, T2>` in C++17) check whether two types are identical.

Modify Types: Traits like `std::remove_reference<T>::type` strip `&` or `&&,` while `std::add_rvalue_reference<T>` adds rvalue references, enabling flexible generic transformations.

## **Universal/Forwarding References & Reference Binding**
***

Binding Rules:
* `const T&` can bind to everything (lvalues, `const` lvalues, rvalues, and `const` rvalues).
* In a deduced context (`template <typename T> void foo(T&& a)`), `T&&` acts as a forwarding reference (universal reference) that can bind to any argument type while preserving value category via reference collapsing.

## **constexpr**
***

Specifies that a function or variable can be evaluated at compile time if its inputs are constant expressions.

Benefits:
* Reduces runtime overhead by precomputing deterministic calculations
* Catches potential logic or type errors early during compilation instead of at runtime.

## **Variadic Templates**
***

Parameter Packs (`typename... Args` / `Args... args`): Allows functions or class templates to accept an arbitrary number of arguments with varying types.