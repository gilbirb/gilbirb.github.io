---
layout: ../../../layouts/Layout.astro
title: COMP2511 - Design Patterns
---

## **Design Patterns**
***

Design patterns are reusable, proven solutions to common problems in software design. They’re not finished code you copy-paste, but general templates or best practices that help you structure your code in a clean, flexible, and maintainable way.

## **Behavioural Patterns**

### **Strategy Pattern**
***

The Strategy pattern is a behavioral design pattern that lets you choose an algorithm (behavior) at runtime instead of hardcoding it.

Instead of writing one big class with lots of if/else logic, you:

* Put each behavior in its own class
* Make them interchangeable
* Let the main class delegate the work

```java
interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using Credit Card");
    }
}

class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using PayPal");
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}
```

### **Observer Pattern**
***

The Observer pattern is a behavioral design pattern where one object (the subject) keeps track of multiple dependent objects (observers) and automatically notifies them when its state changes.

```java
interface Observer {
    void update(String message);
}

class EmailSubscriber implements Observer {
    public void update(String message) {
        System.out.println("Email received: " + message);
    }
}

class SMSSubscriber implements Observer {
    public void update(String message) {
        System.out.println("SMS received: " + message);
    }
}

class YouTubeChannel {
    private List<Observer> subscribers = new ArrayList<>();

    public void subscribe(Observer o) {
        subscribers.add(o);
    }

    public void unsubscribe(Observer o) {
        subscribers.remove(o);
    }

    public void uploadVideo(String title) {
        notifySubscribers(title);
    }

    private void notifySubscribers(String message) {
        for (Observer o : subscribers) {
            o.update(message);
        }
    }
}
```

## **Creational Patterns**

### **Factory Method**

The Factory method is a creational design pattern that provides a way to create objects without exposing the exact class being instantiated.

```java
interface Shape {
    void draw();
}

class Circle implements Shape {
    public void draw() {
        System.out.println("Drawing a Circle");
    }
}

class Rectangle implements Shape {
    public void draw() {
        System.out.println("Drawing a Rectangle");
    }
}

class Square implements Shape {
    public void draw() {
        System.out.println("Drawing a Square");
    }
}

class ShapeFactory {

    public static Shape getShape(String type) {
        if (type.equalsIgnoreCase("circle")) {
            return new Circle();
        } else if (type.equalsIgnoreCase("rectangle")) {
            return new Rectangle();
        } else if (type.equalsIgnoreCase("square")) {
            return new Square();
        }

        throw new IllegalArgumentException("Unknown shape type");
    }
}
```

### **Abstract Factory Pattern**

The Abstract Factory pattern is a creational design pattern that lets you create families of related objects without specifying their concrete classes.

Think of it as a factory of factories.

```java
interface Chair {
    void sitOn();
}

interface Table {
    void use();
}

class ModernChair implements Chair {
    public void sitOn() {
        System.out.println("Sitting on a Modern Chair");
    }
}

class VictorianChair implements Chair {
    public void sitOn() {
        System.out.println("Sitting on a Victorian Chair");
    }
}

class ModernTable implements Table {
    public void use() {
        System.out.println("Using a Modern Table");
    }
}

class VictorianTable implements Table {
    public void use() {
        System.out.println("Using a Victorian Table");
    }
}

interface FurnitureFactory {
    Chair createChair();
    Table createTable();
}

class ModernFurnitureFactory implements FurnitureFactory {
    public Chair createChair() {
        return new ModernChair();
    }

    public Table createTable() {
        return new ModernTable();
    }
}

class VictorianFurnitureFactory implements FurnitureFactory {
    public Chair createChair() {
        return new VictorianChair();
    }

    public Table createTable() {
        return new VictorianTable();
    }
}
```

### **Singleton Pattern**
***
The Singleton pattern ensures that a class has only one instance and provides a global access point to it.

```java
class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

## **Structural Pattern**

### **Composite Pattern**

The Composite pattern is a structural design pattern that lets you treat individual objects and groups of objects the same way.

```java
interface FileSystemItem {
    void show();
}

// Leaf (file)
class File implements FileSystemItem {
    private String name;

    public File(String name) {
        this.name = name;
    }

    public void show() {
        System.out.println("File: " + name);
    }
}

// Composite (folder)
class Folder implements FileSystemItem {
    private String name;
    private List<FileSystemItem> items = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public void add(FileSystemItem item) {
        items.add(item);
    }

    public void show() {
        System.out.println("Folder: " + name);
        for (FileSystemItem item : items) {
            item.show(); // recursive call
        }
    }
}
```
The Factory method can also be used alongside the Composite pattern to simplify the creation of components in a tree structure, especially when different types of objects (e.g., leaf and composite nodes) need to be instantiated dynamically.”
```java
class FileSystemFactory {

    public static FileSystemItem create(JSONObject json) {
        String type = json.getString("type");
        String name = json.getString("name");

        if (type.equals("file")) {
            return new File(name);
        }

        if (type.equals("folder")) {
            Folder folder = new Folder(name);

            JSONArray children = json.optJSONArray("children");
            if (children != null) {
                for (int i = 0; i < children.length(); i++) {
                    JSONObject childJson = children.getJSONObject(i);
                    folder.add(create(childJson)); // recursion
                }
            }

            return folder;
        }

        throw new IllegalArgumentException("Unknown type: " + type);
    }

public class Main {
    public static void main(String[] args) {
        String jsonStr = """
        {
          "type": "folder",
          "name": "root",
          "children": [
            { "type": "file", "name": "a.txt" },
            {
              "type": "folder",
              "name": "docs",
              "children": [
                { "type": "file", "name": "b.txt" }
              ]
            }
          ]
        }
        """;

        JSONObject json = new JSONObject(jsonStr);

        FileSystemItem root = FileSystemFactory.create(json);
        root.show("");
    }
}
}
```

### **Decorator Pattern**
***

The Decorator pattern is a structural design pattern that lets you add new behavior to an object dynamically without changing its code.

```java
interface Coffee {
    double cost();
    String description();
}

class BasicCoffee implements Coffee {
    public double cost() {
        return 5.0;
    }

    public String description() {
        return "Basic Coffee";
    }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;

    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }

    public double cost() {
        return coffee.cost() + 1.5;
    }

    public String description() {
        return coffee.description() + ", Milk";
    }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }

    public double cost() {
        return coffee.cost() + 0.5;
    }

    public String description() {
        return coffee.description() + ", Sugar";
    }
}
```