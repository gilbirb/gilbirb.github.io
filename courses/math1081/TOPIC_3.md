---
layout: course
title: MATH1081 Topic 3 - Proofs and Logic
permalink: /courses/math1081/topic3
toc: false
---

<!-- to preview: bundle exec jekyll serve --livereload -->

Credits to UNSW MathSoc's MATH1081 revision sheet

## **Types of provable statements**
---

### **Universal Statements**

A universal statement is a statement of the form

$$"\forall x \in D, P(x) \text{ is true}"$$

* $D$ is called the domain of disclosure.
* $P(x)$ is some property/statement related to $x$.

The general structure for a proof of a universal
statement is:

$$
\begin{array}{l}
\text{Let } x \in D.\\
.\\
.\\
.\\
\text{Then } P(x) \text{ is true.}
\end{array}
$$

To disprove a universal statement, we only need
to provide a single counterexample.

### **Existential Statements**

An existential statement is a statement of the form

$$"\exists x \in D, \text{ such that }P(x)"$$

The general structure for a proof of an existential
statement is:

$$
\begin{array}{l}
\text{Choose } x \in D \text{ to be }...\\
.\\
.\\
.\\
\text{Then } P(x) \text{ is true.}
\end{array}
$$

To disprove an existential statement, we need to
show the property does not hold for every element in the domain (a universal statement).

### **Conditional Statements**

A conditional statement has the form

$$P \Rightarrow Q$$

or

$$\text{If } P \text{ is true, then } Q \text{ is true.}$$

The general structure for a proof of a conditional statement is:

$$
\begin{array}{l}
\text{Suppose } P \text{ is true.}\\
.\\
.\\
.\\
\text{Then } Q \text{ is true.}
\end{array}
$$

To disprove a conditional statement, we must provide a counterexample where
$P$ is true but $Q$ is false.

### **Converse Statements**

The converse of a conditional statement $"\text{If } P \text{ is true, then } Q \text{ is true}"$
is $"\text{If } Q \text{ is true, then } P \text{ is true}"$.

In other words, the converse of the statement $P \Rightarrow Q$ is $Q \Rightarrow P$

In general, the converse of a statement is independent of the original statement. That is,
proving/disproving a statement does nothing to
prove/disprove its converse, or vice versa.

### **Biconditional Statement**

A biconditional statement has the form $"P \Leftrightarrow Q"$

The double implication symbol $\Leftrightarrow$ is read as "if and only if", or written
"iff" for short.

The general structure for a proof of a biconditional statement is:

$$
\begin{array}{l}
\text{Suppose } P \text{ is true.}\\
.\\
.\\
.\\
\text{Then } Q \text{ is true.}\\
\text{Now suppose } Q \text{ is true.}\\
.\\
.\\
.\\
\text{Then } P \text{ is true.}
\end{array}
$$

To disprove a biconditional statement, disprove either direction.

### **Multiple Quantifiers**

It is possible for a statement to contain more
than one quantifier, such as a statement of the
form $\forall x, \exists y, P(x,y)$.

TODO: ADD MORE

### **Negation**

The negation of a statement is a statement that
is true precisely when the original statement is
false.

For example, $\sim (x = y)$ means the same thing as $x \neq y$

The negation of a universal statement:

$$
\sim \Bigl( \forall x \in D \text{ such that } P(x) \Bigr) \equiv \exists x \in D \text{ such that } \sim P(x).
$$

The negation of an existential statement:

$$
\sim \Bigl( \exists x \in D \text{ such that } P(x) \Bigr) \equiv \forall x \in D \text{ such that } \sim P(x).
$$

The negation of a conditional statement:

$$
\sim \Bigl( P \Rightarrow Q \Bigr) \equiv P \text{ and } \sim Q
$$

The negation of a biconditional statement:

$$
\sim \Bigl( P \Leftrightarrow Q \Bigr) \equiv \sim (P \Rightarrow Q) \text{ or } \sim (Q \Rightarrow P)
$$

When negating a statement with multiple quantifiers, negate each quantifying component in
turn. More precisely, apply the facts that

$$
\sim \Bigl( \exists x P(x) \Bigr) \text{ is equivalent to } \forall x (\sim P(x))
$$

and

$$
\sim \Bigl( \forall x P(x) \Bigr) \text{ is equivalent to } \exists x (\sim P(x))
$$

## **Proof techniques**

### **Contraposition**

The contrapositive of a conditional statement $"\text{If } P \text{ is true, then } Q \text{ is true}"$
is $"\text{If } Q \text{ is false, then } P \text{ is false}"$.

In other words, the contrapositive of $P \Rightarrow Q$ is $\sim Q \Rightarrow \sim P$.

The contrapositive of a statement is equivalent
to the original statement. This means that to
prove any conditional statement, we can instead
prove its contrapositive.

### **Contradiction**

To prove a statement by contradiction, we assume the required result is false, and eventually
derive a fact that is obviously false, which affirms
that the original result was in fact true.

The general structure for a proof by contradiction of a simple statement $“P \text{ is true}”$ is:

$$
\begin{array}{l}
\text{Suppose } P \text{ is false.}\\
.\\
.\\
.\\
\text{This is a contradiction.}\\
\text{Thus } P \text{ is true.}\\
\end{array}
$$

### **Mathematical Induction**

The technique of mathematical induction can be
used to prove results for all elements of a countable set, such as the natural numbers.

Proving the statement $"\text{For all integers }n > n_0, P(n) \text{ is true,}"$ is broken
down into two parts:
- Base case: Prove that $P(n_0)$ is true.
- Inductive step: Prove that $P(k) \Rightarrow P(k+1)$ for all $k \in \mathbb{N}$.

*Strong induction* instead proves in the inductive step that for all $k \in \mathbb{n}$,
if $P(n_0), P(n_0 + 1),..., \text{ and } P(k), \text{ then } P(k+1)$.