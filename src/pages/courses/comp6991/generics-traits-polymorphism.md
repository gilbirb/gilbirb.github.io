---
layout: ../../../layouts/Layout.astro
title: COMP6991 - Generics, Traits & Polymorphism
---

# **Generics, Traits & Polymorphism**

## **Generics**
***

A generic function is written once, over a placeholder type parameter, and the compiler generates the concrete version(s) needed:
```rust
fn largest<T>(list: &[T]) -> T
where
    T: PartialOrd + Copy,
{
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```
`T` is a type parameter. It stands in for whatever concrete type is used at each call site

`T: PartialOrd + Copy` is a trait bound: it restricts T to only types that implement `PartialOrd` and `Copy`. Without these bounds, the function body wouldn't type-check for an arbitrary `T`, because the compiler can't assume any particular type supports comparison or copying.

Generics also apply to structs and enums:
```rust
struct Point<T> {
    x: T,
    y: T,
}

let int_point = Point { x: 5, y: 10 };
let float_point = Point { x: 1.0, y: 4.0 };
```

## **Traits**
***

A trait defines a set of methods a type must implement to be considered to have that behavior. Conceptually close to an interface in Java, but with some important differences covered below.

```rust
trait Summary {
    fn summarize(&self) -> String;
}

struct Article { title: String, body: String }

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}...", self.title, &self.body[..20])
    }
}
```

**Default implementations**

Traits can provide a default method body, which implementors can use as-is or override:
```rust
trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

impl Summary for Article {} // uses the default, no override needed
```

## **Trait Bounds**
***

Trait bounds constrain generic types to those implementing specific traits, letting you call trait methods on generic parameters while the compiler enforces the constraint at compile time.
```rust
fn print_it<T: Display>(item: T) {
    println!("{}", item);
}
```

`T: Display` means "`T` must implement `Display` trait." Without the bound, `println!("{}", item)` wouldn't compile becauuse the compiler can't assume `T` supports formatting.

For multiple or complex bounds, `where` is more readable than inline bounds:
```rust
fn process<T, U>(t: T, u: U) -> String
where
    T: Display + Clone,
    U: Debug,
{
    format!("{} {:?}", t, u)
}
```
The `+` combines multiple bounds on one type.

For simple cases, `impl Trait` in argument position is equivalent to a trait-bounded generic:
```rust
fn print_it(item: impl Display) { ... }
```
It also works in return position:
```rust
fn make_thing() -> impl Iterator<Item = i32> {
    (1..5).map(|x| x * 2)
}
```

## **Static vs. Dynamic Dispatch**
***

Rust gives you two different mechanisms for polymorphism, with a genuine performance/flexibility trade-off between them, and it makes you choose explicitly rather than picking one for you.

### **Static dispatch: generics / impl Trait (monomorphisation)**
***

When you write a generic function, the compiler generates a **separate, specialized copy** of that function for every concrete type it's actually called with, at compile time. This process is called **monomorphisation**.
```rust
fn notify<T: Summary>(item: &T) { ... }

notify(&article);   // compiler generates notify::<Article>(...)
notify(&tweet);      // compiler generates notify::<Tweet>(...)
```

At the machine-code level, there are now two entirely separate functions, each calling `summarize()` as a direct, non-virtual function call.

This is **static dispatch**: the specific function called is resolved at **compile time**, not runtime.

Consequence: 
* zero runtime overhead: as fast as if you'd hand-written each version yourself
* larger binary size (one copy per concrete type used)
* concrete type must be known at compile time.

### **Dynamic dispatch: trait objects (dyn Trait)**
***

Sometimes you genuinely don't know the concrete type until runtime, e.g. a `Vec` holding a mix of different types that all implement the same trait. Monomorphisation can't help here, because there's **no single concrete type to generate code for**.
```rust
let items: Vec<Box<dyn Summary>> = vec![
    Box::new(article),
    Box::new(tweet),
];

for item in &items {
    println!("{}", item.summarize()); // resolved at RUNTIME
}
```

`dyn Trait` is a **trait object**, instead of the concrete type, it stores a pointer to the data plus a vtable (a table of function pointers to that specific type's trait method implementations). At the call site, the program looks up the right function pointer in the vtable and calls through it - an extra indirection compared to static dispatch.

`dyn Trait` is **unsized** (its size isn't known at compile time as it could be any implementing type), which is why it's almost always seen behind an indirection: `Box<dyn Trait>`, `&dyn Trait`, `Rc<dyn Trait>`.

&nbsp; | Static dispatch | Dynamic dispatch
--- | --- | ---
Resolved	| Compile time |	Runtime
Mechanism |	Monomorphisation: separate compiled copy per type |	Vtable: pointer to function implementations
Runtime cost |	None: direct function calls	| One indirection (vtable lookup) per call
Binary size	| Larger (code duplicated per type)	| Smaller (one shared implementation)
Can mix different concrete types in one collection? |	No: `Vec<T>` needs one concrete `T`	| Yes: `Vec<Box<dyn Trait>>` can hold different types
Type known at compile time? |	Required | 	Not required

Rust gives you a fast, compile-time-resolved default (generics), and an explicit, clearly-marked opt-in (dyn) for the cases where you genuinely need runtime flexibility, rather than forcing one universal mechanism (like Java, where virtual dispatch is the default for all methods, paying the indirection cost even when you don't need the flexibility).

## **Common Standard Traits**
***

| Trait | Grants |
|---|---|
| `Debug` | `{:?}` formatting, usually `#[derive(Debug)]` |
| `Clone` | `.clone()`: explicit deep copy|
| `Copy` | Implicit bitwise duplication instead of move|
| `PartialEq` / `Eq` | `==` comparison |
| `PartialOrd` / `Ord` | `<`, `>`, sorting |
| `Iterator` | `next()` and the whole adaptor chain |
| `Default` | `T::default()`: a sensible default value |