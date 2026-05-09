---
layout: ../../../layouts/Layout.astro
title: COMP2511 - Design Principles
---

## **Design Principles**
***

Design principles provide guidelines to develop systems that are maintainable, flexible, reusable, and robust

## **SOLID Principles**
***

* **Single Responsibility Principle (SRP)**

A class should have only one reason to change, focusing on a single functionality.

Bad - one class doing two unrelated things:
```java
class Invoice {
    public double calculateTotal() { /* ... */ }
    public void saveToDatabase() { /* ... */ }
}
```

Good - split responsibilities:
```java
class Invoice {
    public double calculateTotal() { /* ... */ }
}

class InvoiceRepository {
    public void save(Invoice invoice) { /* ... */ }
}
```

* **Open/Closed Principle (OCP)**

Software entities should be open for extension but closed for modification.

Bad - must modify the class to add new shapes:
```java
class AreaCalculator {
    public double area(Object shape) {
        if (shape instanceof Circle) { /* ... */ }
        else if (shape instanceof Square) { /* ... */ }
        return 0;
    }
}
```

Good - extend by adding new subclasses, no modification needed:
```java
interface Shape {
    double area();
}

class Circle implements Shape {
    public double area() { /* ... */ return 0; }
}

class Square implements Shape {
    public double area() { /* ... */ return 0; }
}

class AreaCalculator {
    public double area(Shape shape) {
        return shape.area();
    }
}
```

* **Liskov Substitution Principle (LSP)**

Objects of a superclass should be replaceable with objects of subclasses without affecting the correctness of the program.

Bad - subclass breaks parent's contract:
```java
class Bird {
    public void fly() { /* ... */ }
}

class Penguin extends Bird {
    public void fly() {
        throw new UnsupportedOperationException();
    }
}
```

Good - separate behaviour so subtypes honour the contract:
```java
class Bird { /* common bird behaviour */ }

class FlyingBird extends Bird {
    public void fly() { /* ... */ }
}

class Penguin extends Bird { /* no fly method */ }
```

* **Interface Segregation Principle (ISP)**

Clients should not be forced to depend on interfaces they do not use. Favor many specific interfaces over a single general-purpose one.

Bad - one fat interface forces unused methods:
```java
interface Worker {
    void work();
    void eat();
}

class Robot implements Worker {
    public void work() { /* ... */ }
    public void eat() {
        throw new UnsupportedOperationException();
    }
}
```

Good - split into focused interfaces:
```java
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

class Robot implements Workable {
    public void work() { /* ... */ }
}

class Human implements Workable, Eatable {
    public void work() { /* ... */ }
    public void eat() { /* ... */ }
}
```

* **Dependency Inversion Principle (DIP)**

Depend on abstractions, not concrete implementations. Higher-level modules should not depend on lower-level modules but rather on abstractions.

Bad - high-level class depends directly on a concrete class:
```java
class MySQLDatabase {
    public void save(String data) { /* ... */ }
}

class UserService {
    private MySQLDatabase db = new MySQLDatabase();

    public void register(String user) {
        db.save(user);
    }
}
```

Good - depend on an abstraction, inject the implementation:
```java
interface Database {
    void save(String data);
}

class MySQLDatabase implements Database {
    public void save(String data) { /* ... */ }
}

class UserService {
    private Database db;

    public UserService(Database db) {
        this.db = db;
    }

    public void register(String user) {
        db.save(user);
    }
}
```
