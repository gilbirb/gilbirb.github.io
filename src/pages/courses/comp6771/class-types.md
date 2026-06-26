---
layout: ../../../layouts/Layout.astro
title: COMP6771 - Class Types
---

# **Class Types**

## **Scope**
***

The scope of a variable is the part of the program where it is accessible.
* Scope starts at variable definition
* Scope (usually) ends at next "}"

Ways to create scopes:
* Classes
* Namespaces
* Functions
* Global
* Random braces

## **Object Lifetimes**
***

An object is a piece of memory of a specific type that holds some data
* All variables are objects
* Unlike many other languages, this does not add overhead

Object lifetime starts when it comes in scope
* "Constructs" the object
* Each type has 1 or more constructor that says how to construct it

Object lifetime ends when it goes out of scope
* "Destructs" the object
* Each type has a different "destructor" which tells the compiler how to destroy it

## **Construction**
***

Construction describes the process of allocating the memory and setting up for the creation of an object. 

```cpp
#include <vector>
 
auto main() -> int
{
    std::vector<int> v11; // Calls 0-argument constructor. Creates empty vector.
 
    // There's no difference between these:
    // T variable = T{arg1, arg2, ...}
    // T variable{arg1, arg2, ...}
    auto v12 = std::vector<int> {}; // No different to first
    auto v13 = std::vector<int>(); // No different to the first
 
    {
        auto v2 = std::vector<int> { v11.begin(), v11.end() }; // A copy of v11.
        auto v3 = std::vector<int> { v2 }; // A copy of v2.
    } // v2 and v3 destructors are called here
 
    auto v41 = std::vector<int> { 5, 2 }; // Initialiser-list constructor {5, 2}
    auto v42 = std::vector<int>(5, 2); // Count + value constructor (5 * 2 => {2, 2, 2, 2, 2})
} // v11, v12, v13, v41, v42 destructors called here
```

## **Namespaces**
***

Used to express that names belong together

```cpp
// lexicon.hpp
namespace lexicon {
std::vector<std::string> read_lexicon(std::string const& path);
 
void write_lexicon(std::vector<std::string> const&, std::string const& path);
} // namespace lexicon
```

We can create **unnamed namespaces** to provide a similar capability as C when it comes to functions local to a file.

We can also nest them

```cpp
namespace word_ladder {
namespace {
    bool valid_word(std::string const& word);
} // namespace
} // namespace word_ladder
```

We can also use **namespace aliases** to give a namespace a new name. It's often great for shortening nested namespaces.
```cpp
namespace chrono = std::chrono;
```

It's important to always fully-qualify your namespaces even if you're already in that namespace.

```cpp
namespace word_ladder {
namespace {
    bool valid_word(std::string const& word);
} // namespace
 
std::vector<std::vector<std::string>>
generate(std::string const& from, std::string const& to)
{
    // ...
    // write word_ladder::valid_word(word) rather than just valid_word(word)
    auto const result = word_ladder::valid_word(word); 
    // ...
}
} // namespace word_ladder
```

## **Object-oriented Programming (OOP)**
***

A class uses data abstraction and encapsulation to define an abstract data type:
* Abstraction: separation of interface from implementation
* Encapsulation: enforcement of this via information hiding

This abstraction leads to two key parts of the abstract data type:
* Interface: the operations used by the user (an API)
* Implementation: the data members the bodies of the functions in the interface and any other functions not intended for general use

## **Member Access Control**
***

This is how we support encapsulation and information hiding in C++

```cpp
class foo {
public:
    // Members accessible by everyone
    foo(); // The default constructor.
 
protected:
    // Members accessible by members, friends, and subclasses
 
private:
    // Accessible only by members and friends
    void private_member_function();
    int private_data_member_;
 
public:
    // May define multiple sections of the same name
};
```
## **Constructor**
***

A basic constructor would look like
```cpp
#include <iostream>
 
class myclass {
public:
    myclass(int i)
    {
        i_ = i;
    }
    int getval()
    {
        return i_;
    }
 
private:
    int i_;
};
 
int main()
{
    auto mc = myclass { 1 };
    std::cout << mc.getval() << "\n";
}
```

A **Constructor Initializer List** is a way to initialize class member variables before the constructor body executes

A constructor will:
1. Construct all data members in order of member declaration (using the same rules as those used to initialise variables)
2. Construct any undefined member variables that weren't defined in step (1)
3. Execute the body of constructor: the code may assign values to the data members to override the initial values

```cpp 
class myclass {
public:
    myclass(int i)
        : i_ { i }
    {
    }
private:
    int i_;
}
```

**Constructor Logic Summary**
* Constructors define how class data members are initalised
* A constructor has the same name as the class and no return type
* Default initalisation is handled through the default constructor
* Unless we define our own constructors the compile will declare a default constructor
    * This is known as the synthesized default constructor
```
for each data member in declaration order
if it has an used defined initialiser
  Initialise it using the used defined initialiser
else if it is of a built-in type (numeric, pointer, bool, char, etc.)
  do nothing (leave it as whatever was in memory before)
else
  Initialise it using its default constructor
```

**Delegating Constructors**
* A constructor may call another constructor inside the initialiser list
    * Since the other constructor must construct all the data members, do not specify anything else in the constructor initialiser list
    * The other constructor is called completely before this one.
    * This is one of the few good uses for default values in C++
        * Default values may be used instead of overloading and delegating constructors
```cpp 
class dummy {
public:
    explicit dummy(int const& i)
        : s_ { "Hello world" }
        , val_ { i }
    {
    }
    explicit dummy()
        : dummy(5)
    {
    }
    std::string const& get_s()
    {
        return s_;
    }
    int get_val()
    {
        return val_;
    }
 
private:
    std::string s_;
    const int val_;
};
 
auto main() -> int
{
    dummy d1(5);
    dummy d2 {};
}
```

Using default value alternative:
```cpp
class dummy {
public:
    explicit dummy(int const& i = 5)
        : s_ { "Hello world" }
        , val_ { i }
    {
    }
    std::string const& get_s()
    {
        return s_;
    }
    int get_val()
    {
        return val_;
    }
 
private:
    std::string s_;
    const int val_;
};
 
auto main() -> int
{
    dummy d1(5);  // i = 5
    dummy d2 {};  // i defaults to 5, no delegating constructor needed
}
```

## **Destructors**
***

Called when the object goes out of scope

Useful for:
* Freeing pointers
* Closing files
* Unlocking mutexes (from multithreading)
* Aborting database transactions

noexcept states no exception will be thrown

```cpp
// In the header (.h)
class MyClass {
    ~MyClass();  // tilde ~ prefix = destructor
};

// In the implementation (.cpp)
MyClass::~MyClass() {
    // cleanup code here
}
```

## **"This" Pointer**

A member function has an extra implicit parameter, named **this**
* This is a pointer to the object on behalf of which the function is called
* A member function does not explicitly define it, but may explicitly use it
* The compiler treats an unqualified reference to a class member as being made through the this pointer.
* Generally we use a "_" suffix for class variables rather than a this-> to identify them

```cpp
class myclass {
public:
    myclass(int i)
    {
        this->i_ = i; // doing i_ = i; works exactly the same
    }
    int getval()
    {
        return this->i_; // doing return i_; works exactly the same
    }
 
private:
    int i_;
};
```

## **Class Scopes**
***

Anything declared inside the class needs to be accessed through the scope of the class
* Scopes are accessed using "::" in C++

```cpp
// In scope.h
class Foo {
public:
    // Equiv to typedef int Age
    using Age = int;
 
    Foo();
    Foo(std::istream& is);
    ~Foo();
 
    void member_function();
};

// In scope.cpp
#include "scope.h"
 
Foo::Foo()
{
    // construct here
}
 
Foo::Foo(std::istream& is)
{
    // stuff here
}
 
Foo::~Foo()
{
    // destruct here
}
 
void Foo::member_function()
{
    Foo::Age age;
    // Also valid, since we are inside the Foo scope.
    Age age;
}
```

## **Incomplete Types**
***

An incomplete type may only be used to define pointers and references, and in function declarations (but not definitions)

Because of the restriction on incomplete types, a class cannot have data members of its own type.

```cpp
struct node {
  int data;
  // Node is incomplete - this is invalid
  // it can't use node as a member because that would be infinitely recursive in size.
  node next;
};
```

But a pointer is fine:
```
struct node {
  int data;
  node* next;
};
```

## **Classes & Structs**
***

A class and a struct in C++ are almost exactly the same, the only difference is that:
* All members of a struct are public by default
* All members of a class are private by default

Only use structs when we want a simple type with little or no methods and direct access to the data members

## **Explicit Keyword**
***

If a constructor for a class has 1 parameter, the compiler will create an implicit type conversion from the parameter to the class

This may be the behaviour you want (but usually not) You have to opt-out of this implicit type conversion with the explicit keyword

```cpp
class intvec {
public:
    // This one allows the implicit conversion
    // intvec(std::vector<int>::size_type length)
    // : vec_(length, 0);
 
    // This one disallows it.
    explicit intvec(std::vector<int>::size_type length)
        : vec_(length, 0)
    {
    }
 
private:
    std::vector<int> vec_;
};
 
auto main() -> int
{
    int const size = 20;
    // Explictly calling the constructor.
    intvec container1 { size }; // Construction
    intvec container2 = intvec { size }; // Assignment
 
    // Implicit conversion.
    // Probably not what we want.
    // intvec container3 = size;
}
```

## **Const Members**
***

Member functions are by default only callable by non-const objects
* You can declare a const member function which is valid on const objects and non-const objects
* A const member function may only modify mutable members

```cpp
class counter {
    int count = 0;
public:
    void increment() { count++; }   // regular method - modifies the object
    int get() const { return count; } // const method - promises not to modify
};

const counter c;
c.get();       // allowed - get() is marked const
c.increment(); // compile error - increment() is not const
```

## **Static Members**
***

Static members belong to the class (i.e. every object), as opposed to a particular object.

These are essentially globals defined inside the scope of the class
* Use static members when something is associated with a class, but not a particular instance
* Static data has global lifetime (program start to program end)

## **Defaults**
***

The Synthesized Default Constructor
* Generated for a class **only if it declares no constructors**
* For each member, calls the **in*class initialiser** if present
* Otherwise calls the **default constructor** (except for trivial types like `int`)
* Cannot be generated when any data members are missing **both** in-class initialisers and default constructors

```cpp
class A {
  int a_;
};

class B {
  B(int b): b_{b} {
  }
  int b_;
};

int main() {
  int i_{0}; // in-class initialiser
  int j_;    // Untouched memory
  A a_;
  // This stops default constructor
  // from being synthesized.
  B b_;
};
```

---

**Deleting Unused Default Member Functions**

There are several special functions to consider when designing classes. Ask yourself:

**Does it make sense to have this default member function?**

- **Yes** → Does the compiler-synthesised function make sense?
  - **No** → Write your own definition
  - **Yes** → Write `<function declaration> = default;`
- **No** → Write `<function declaration> = delete;`

---

Default & Delete - Copy Constructor Example

```cpp
#include <vector>

class intvec {
public:
    // explicit prevents implicit conversion
    explicit intvec(std::vector<int>::size_type length)
        : vec_(length, 0)
    {
    }
    // intvec(intvec const& v) = default;
    // intvec(intvec const& v) = delete;

private:
    std::vector<int> vec_;
};

auto main() -> int
{
    intvec a { 4 };
    // intvec b{a}; // Will this work?
}
```

- With `= default;` -> copy is allowed, and uses the compiler-generated copy (which copies `vec_`)
- With `= delete;` -> `intvec b{a};` is a **compile error**
- With neither (commented out) -> compiler synthesises a copy constructor since no rule prevents it