---
layout: ../../../layouts/Layout.astro
title: COMP2511 - Code Smells
---

## **Code Smells**
***

### Duplicated Code
***

Very similar logic appears in multiple places instead of being reused from a single source

Case 1: Same code in multiple methods of the same class
* Use Extract Method and invoke it from each place.

Case 2: Same code in two subclasses of the same level
* Use Extract Method in both subclasses, Use Pull Up Field or Pull Up Method to unify code in the
superclass.
* If inside constructors: use Pull Up Constructor Body.
* For similar but not identical code: use Template Method.
* If algorithms differ, use Strategy Pattern.

Case 3: Duplicate code in unrelated classes
* Use Extract Superclass to unify shared logic.

Bad Example

```java
public class InvoiceService {

    public double calculateTotalWithTax(double amount) {
        double tax = amount * 0.1;
        return amount + tax;
    }

    public double calculateDiscountedTotal(double amount) {
        double tax = amount * 0.1; // duplicated code
        double discounted = amount * 0.9;
        return discounted + tax;
    }
}
```

Improved version
```java
public class InvoiceService {

    private double calculateTax(double amount) {
        return amount * 0.1;
    }

    public double calculateTotalWithTax(double amount) {
        return amount + calculateTax(amount);
    }

    public double calculateDiscountedTotal(double amount) {
        double discounted = amount * 0.9;
        return discounted + calculateTax(amount);
    }
}
```

### Long Method
***

A long method is a function that does too much, often dozens of lines handling multiple responsibilities.

Bad Example
```java
public class OrderService {

    public void processOrder(double amount) {
        // validate
        if (amount <= 0) {
            System.out.println("Invalid amount");
            return;
        }

        // calculate tax
        double tax = amount * 0.1;
        double total = amount + tax;

        // apply discount
        if (amount > 100) {
            total = total * 0.9;
        }

        // print receipt
        System.out.println("Amount: " + amount);
        System.out.println("Tax: " + tax);
        System.out.println("Total: " + total);
    }
}
```

An improved version would be to split each functionalities to smaller methods.

### Large Class
***

A large class is a class that tries to do too many things, often handling multiple responsibilities that should be split across smaller, focused classes.

### Long Parameter List
***
A long parameter list is when a method takes too many arguments, especially when they’re hard to remember or often passed together.

To avoid long parameter lists, encapsulate related parameters into a data class and pass an instance of that class instead.

### Divergent Change
***

Divergent Change is a code smell where one class has to be modified for many different kinds of changes.

In other words, a single class is responsible for multiple unrelated concerns, so different types of updates all hit the same file.

Violates Single Responsibility Principle.

Increases risk of regression bugs due to unrelated
modifications

### Shotgun Surgery
***

Shotgun Surgery is a code smell where a single change requires modifying many different classes or files.

Instead of one clear place to update behavior, the logic is scattered everywhere, so even a small change forces you to “spray” edits across the codebase (hence the shotgun analogy).

Makes code brittle and hard to maintain.

Divergent Change vs Shotgun Surgery
* Divergent Change = One class changes for many unrelated reasons.
* Shotgun Surgery = One change spreads across many classes.

### Feature Envy
***

Feature Envy is a code smell where a method in one class is more interested in (i.e., uses) the data of another class than its own.

Bad Example
```java
public class Order {
    Customer customer;

    public double calculateDiscount() {
        // accessing lots of Customer data
        if (customer.getLoyaltyPoints() > 1000) {
            return customer.getPurchaseHistory() * 0.1;
        }
        return 0;
    }
}
```

Improved Version
```java
public class Customer {

    private int loyaltyPoints;
    private double purchaseHistory;

    public double calculateDiscount() {
        if (loyaltyPoints > 1000) {
            return purchaseHistory * 0.1;
        }
        return 0;
    }
}

public class Order {
    Customer customer;

    public double calculateDiscount() {
        return customer.calculateDiscount();
    }
}
```

### Lazy Classes
***
A Lazy Class is a class that does too little to justify its existence.

It might have:
* only one small method
* minimal data
* no real responsibility

Bad Example
```java
public class Price {
    private double amount;

    public Price(double amount) {
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }
}

public class Product {
    private Price price;

    public Product(Price price) {
        this.price = price;
    }

    public double getPrice() {
        return price.getAmount();
    }
}
```
Problem:

* `Price` just wraps a `double`
* No real behavior. It doesn’t justify being its own class

Improved Version (remove or merge)
```java
public class Product {
    private double price;

    public Product(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
}
```

### Data Class
***

A Data Class is a class that only holds data (fields + getters/setters) but has little or no behavior (logic).

Data Class vs Lazy Class:
* Data Class → Has data, but lacks behavior
* Lazy Class → Has too little of anything to justify existing