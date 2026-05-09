---
layout: ../../../layouts/Layout.astro
title: COMP2511 - Software Architecture
---

## **Software Architecture Characteristics**
***

| Characteristic | Description |
|----------|----------|
| Availability  | Percentage of time the system is operational  |
| Performance  | How fast the system responds under given load  |
| Reliability | Ability to run consistently without errors |
| Scalability  | Ability to handle increased workload (users,data)  |
| Fault tolerance | Ability to gracefully handle errors and failures |
| Maintainability | Ease of making changes, fixing bugs, or adding new features |
| Extensibility | Ability to add new functionality with minimal changes |
| Supportability | How easy it is to maintain and support the system over time |
| Portability | The system should work across different environments |
| Configurability | Ability to configure the system according to needs 
| Security | Protection against threats, unauthorised access |
| Testability | How easily the system can be tested |
| Deployability | How easy is it to deploy software |
| Accessibility | The system is usable by a wide range of people, including those with disabilities |
| Usability | Ensuring the system is easy to use and intuitive for users |
| Privacy | Protecting users’ sensitive information |
| Feasibility | The system should be realistic to develop within the constraints |
| Elasticity | System adjusts its resource consumption based on the load it is placed under |
| Observability | Ability to measure the internal states of a system |

## **Software Architecture Styles**
***

Predefined patterns and philosophies guiding how software systems
are structured and deployed.

Two main categories for architectural styles:
1. Partitioning
    * Technical vs. Domain-based.
2. Deployment
    * Monolithic vs. Distributed.

**Partitioning by Technical Concerns:**
* Code organized by functional roles or technical layers
* Clear separation of responsibilities.
* Easier specialization of teams.
* Example: Presentation Layer (UI), Business Logic Layer (Services), Data Persistence Layer (Database)

**Partitioning by Domain Concerns:**
* Code organized around business domains or problem areas.
* Alignment with business goals.
* Easier maintenance of related features.
* Strong domain modeling
* Example: Customer Domain (user accounts, user interface), Inventory Domain (product catalog, stock management), Payment Domain (billing, transactions)

| Technical Partitioning | Domain Partitioning |
| ---------------------- | --------------------|
| Layered by technical roles | Organized by business areas |
| Easier for specialised teams | Aligned closely with business needs |
| Risk of over-generalisation | Risk of duplicating common functionalities |

**Deployment Models Overview**

1. Monolithic Architecture
    * Single deployable unit.
2. Distributed Architecture
    * Multiple deployable units communicating over networks.

**Monolithic Architecture**
* Entire application deployed as one single executable
or package.
* Pros
    * Easier initial development.
    * Simplified debugging.
    * Lower initial deployment cost.
* Cons
    * Difficult to scale independently.
    * Single bug can disrupt entire system.
    * Inflexible when adapting to changing demands.

**Distributed Architecture**
*  Application components deployed separately, each as
individual processes/services.
* Pros
    * Independent scalability of components.
    * Encourages modular design.
    * Fault isolation—failures affect only single units.
* Cons
    * High complexity due to network dependence.
    * Increased maintenance and debugging complexity.
    * Higher infrastructure and operational costs.

## **Layered Architecture**
***

* Layered Architecture separates technical
responsibilities into distinct layers.
* Simplifies the design by dividing the system into
manageable, logical parts.
* Key benefits:
    * Easy to understand and implement.
    * Promotes reuse and separation of concerns.
* Technically partitioned and usually monolithic.
* Domain logic spans multiple layers:
    * Presentation (UI components).
    * Workflow (business logic components).
    * Persistence (database schemas and operations).

Why choose layered architecture?
* Specialization: Separates UI, business logic, and database, allowing team specialisation.
* Physical separation: Matches real-world technology separation (frontend / backend / database).
* Ease of reuse: Technical reuse across multiple projects.
* Familiarity: Mirrors MVC, easy for developers to grasp.

Strengths
* Feasibility: Quick, cost-effective solutions.
* Technical partitioning: Easy technical reuse.
* Data-intensive operations: Efficient local data processing.
* Performance: High internal performance without network overhead.
* Fast development: Ideal for MVPs and small systems.

Weakness
* Deployability: Monolith deployments become cumbersome as systems grow.
* Coupling: High risk of tight coupling.
* Scalability: Difficult to scale individual functionalities independently.
* Elasticity: Poor performance under bursty traffic conditions.
* Testability: Increasingly difficult testing as codebase grows.

Summary
* Simple, fast to implement.
* Clearly separates technical concerns.
* Ideal for stable domains with minimal changes.
* Challenging to adapt when domain changes significantly.

## **Modular Monolith**
***

A monolithic architecture organized by domain, not technical layers.

Why Choose a Modular Monolith?
* Business alignment: Modules map to subdomains
* Team ownership: Cross-functional teams per domain
* Faster changes: Changes isolated to one module
* High performance: No inter-service network latency
* Easier testing: Scoped test suites per module

Structure
* Organised around business domains (e.g. Orders, Payments, Inventory) rather than technical layers.
* Each module encapsulates its own domain logic, data, and APIs.
* Modules communicate through well-defined interfaces, not direct database access.
* Deployed as a single unit, but internally decomposed like microservices.

Strengths
* Domain partitioning: Code is organised by business capability, improving understandability.
* Maintainability: Clear module boundaries reduce ripple effects from changes.
* Modularity: Easier to evolve individual modules without rewriting the system.
* Performance: In-process calls avoid the latency of distributed systems.
* Migration path: Provides a stepping stone toward microservices if needed.

Weakness
* Deployability: Still deployed as a single artifact, one bad change can affect the whole system.
* Scalability: Cannot scale individual modules independently.
* Elasticity: Limited ability to handle bursty, module-specific load.
* Discipline required: Module boundaries must be enforced; otherwise it degrades into a "big ball of mud".
* Fault tolerance: A failure in one module can bring down the entire application.

Summary
* Combines the simplicity of a monolith with the organisational benefits of domain-driven design.
* Ideal when the domain is well-understood but the team isn't ready for distributed complexity.
* Best suited for systems where business alignment matters more than independent scaling.
* Often a precursor to microservices once modules stabilise and scaling needs diverge.

## **Microservices**
***

* Microservices are single-purpose, independently deployed units.
* Ideal for environments requiring frequent changes and scalability.

### **Microservice**
***

* A microservice performs one specific function exceptionally well.
* Key characteristics:
    * Own their own data (Physical bounded contexts).
    * Direct data access restricted to owning microservice.

### **Granularity**
***
* Granularity is the scope of a microservice’s responsibility.
* Generally, we want to avoid too fine-grained granularity ("Grains of Sand" antipattern).

* Granularity Disintegrators (Reasons to Make Services Smaller)
    * Cohesion: Functions within a service should be closely related.
    * Fault Tolerance: Separating unstable functions for better reliability.
    * Access Control: Easier management of sensitive data.
    * Code Volatility: Isolating frequently changing parts.
    * Scalability: Independent scaling for high-demand components.

* Granularity Integrators (Reasons to Make Services Larger)
    * Database Transactions: Easier to manage single commit/rollback operations.
    * Data Dependencies: Maintain tightly coupled data together.
    * Workflow Efficiency: Reduce excessive inter-service communication.

* Sharing Functionality
    * Shared Services: 
        * Standalone services that provide functionality to other services over the network (via APIs). 
        * They are deployed and run independently.
        * Agile, suitable for diverse environments, slower, less fault-tolerant.
    * Shared Libraries: 
        * Reusable code packaged and included within each service at build time. 
        * They run as part of the service itself.
        * Faster, scalable, robust, but challenging dependency management.

* Workflow Management
    * Orchestration
        * Central orchestration manages workflow, akin to a symphony conductor.
        * Pros: Centralized management, clear state/error handling.
        * Cons: Bottlenecks, high coupling, performance concerns.
    * Choreography
        * Peer-to-peer service communication, like a coordinated dance.
        * Pros: Scalable, loosely coupled, high responsiveness.
        * Cons: Complex error and state management.

* Advantages of Microservices
    * Maintainability, Testability, Deployability, Evolvability.
    * Exceptional scalability and fault tolerance.

* Limitations of Microservices
    * Complexity, especially in workflow management.
    * Performance issues due to inter-service communications.

* Summary
    * Microservices offer high flexibility but involve significant complexity.
    * Requires crucial granularity and communication decisions.
    * Evaluate and manage trade-offs carefully.

## **Event-Driven Architecture**
***

* Event-Driven Architecture (EDA) structures systems to respond to events, which are significant changes in system state. 

*  Unlike request-driven systems, EDA components don't directly call each other.

* Events
    * An event represents something that has already occurred and carries data about it. 
    * Events are immutable and often used as triggers.
    * Example: "User Registered" event might include the user ID, name, and email.

### Asynchronous vs. Synchronous Communication
***

* In synchronous calls, the sender waits for a response. 
* In asynchronous communication, it continues immediately after sending.
    * Benefit: Loose coupling allows services to operate and scale independently, increasing speed and fault tolerance.
    * Trade-off: Asynchronous systems complicate debugging and tracing since there’s no immediate response

### Database Topologies
***

How services access and manage data affects **modularity** and **scaling**.

Examples:
* Monolithic DB: All services write to one database (fast, tightly coupled).
* Domain-Partitioned: Related services share DB (moderately coupled).
* DB-per-Service: Each microservice owns its DB (fully decoupled, but complex joins require events).

### EDA vs. Microservices
***

* Microservices focus on small, self-contained services communicating via HTTP or RPC.
* EDA emphasizes event-based coordination.

### Event-Driven Microservices
***

This hybrid model combines independent
services with event communication, boosting
flexibility.

Example:
* Inventory, Shipping, and Billing each own
their DB and listen to "Order Placed" to act
asynchronously.

### EDA Challenges
***

EDA introduces challenges with **observability** and **testing** due to distributed
asynchronous operations.

### EDA Advantages
***

EDA shines in environments requiring responsiveness, scalability, and autonomy.

Examples:
* Maintainability: Add new features without changing existing services.
* Performance: Events processed in parallel.
* Scalability: Individual components scale independently.

## **Serverless Architecture**
***

* Serverless computing allows developers to build and run applications without managing infrastructure.

* Developers focus on deploying individual functions without managing servers.

* Cloud provider dynamically manages server allocation.

* Function is executed in response to events.

* Also known as Function-as-a-Service (FaaS).

### Key Characteristics
***

* Auto-scaling: Instantly handles thousands of concurrent executions
* Faster time-to-market: Developers focus on business logic, not infrastructure
* High availability: Functions are distributed across multiple availability zones
* Event-driven: Executes on triggers like HTTP requests, file uploads, or database changes
* Micro-billing: You pay only for execution time, usage-based cost
* Short-lived functions: Ideal for tasks that complete quickly

### Serverless Design Principles
***

* Stateless: Don’t rely on local memory; use shared storage (e.g., S3, DynamoDB)
* Event-driven: Design workflows around events, not request-response chains
* Minimal and composable functions: Keep single-responsibility per function
* Use queues/pubs/subs: Decouple flows using queues or Publish-subscribe messaging services

### Limitations and Challenges
***

Cold starts:
* Latency when functions are idle for a while (especially for JVM/.NET)
* Mitigation: Use warm-up plugins or provisioned concurrency

Vendor lock-in:
* Tied to provider’s ecosystem (e.g., AWS SDKs, IAM policies)

Observability:
* Harder to trace request flows across functions
* Solution: Use distributed tracing (e.g., AWS X-Ray, OpenTelemetry)

Resource limits:
* Timeout (after a few mins on AWS Lambda)
* Memory and ephemeral storage constraints

### Comparison: Serverless vs. Microservices
***

| Feature | Microservices (Containers) | Serverless (Functions) |
| --- | --- | --- |
| Deployment unit | Container | Function |
| Management | DevOps / CI / CD pipeline | Fully managed by provider
| Cost model | Fixed per compute unit | Per request, per execution time |
| Scaling | Container autoscaling | Scales with invocations |
| Startup time | Low latency (warm) | Cold starts may delay execution |
| Monitoring | Full stack observability | Requires custom integration |

### Summary
***

* Serverless abstracts server management and reduces operational burden
* Works best for stateless, event-driven, and high-concurrency use cases
* Challenges include observability, cold starts, and vendor-specific tooling
* Ideal as a lightweight, cost-effective architecture for modern cloud-native apps