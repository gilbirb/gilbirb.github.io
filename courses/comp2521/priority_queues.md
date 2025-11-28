---
layout: course
title: COMP2521 - Priority Queues and Heaps
permalink: /courses/comp2521/pq_and_heaps
toc: false
---

<!-- to preview: bundle exec jekyll serve --livereload -->

## **Priority Queue**
***

A priority queue is an abstract data type where each item has an associated priority.

A priority queue supports the following main operations:
* Insert: insert an item with an associated priority
* Delete: delete (and return) the item with the highest priority
* Peek: get the item with the highest priority, without deleting it
* Is empty: check if the priority queue is empty

### **Priority Queue Implementations**
***

Unordered array:
* Insert: O(1)
* Delete: O(n)
* Peek: O(n)
* Is empty: O(1)

Ordered array:
* Insert: O(n)
* Delete: O(1)
* Peek: O(1)
* Is empty: O(1)

Unordered linked list:
* Insert: O(1)
* Delete: O(n)
* Peek: O(n)
* Is empty: O(1)

Ordered linked list:
* Insert: O(n)
* Delete: O(1)
* Peek: O(1)
* Is empty: O(1)


## **Heaps**
***

A heap is a tree-based data structure which satisfies the heap property.

The heap property specifies how values in the heap should be ordered,
and depends on the kind of heap:

In a **max heap**, the value in each node must be
greater than or equal to the values in its children.

In a **min heap**, the value in each node must be
less than or equal to the values in its children.

A **binary heap** is a heap that takes the form of a binary tree, and satisfies the following properties:
* Heap property
* Completeness property
  * all levels of the tree (except possibly the last) must be fully filled
and the last level must be filled from left to right

A result of the completeness property is that binary heaps always contain $\lfloor \log_2  n \rfloor + 1$ levels
where $n$ is the number of nodes.

Heaps are usually implemented with an array.

For a binary heap, index 1 of the array contains the root item,
the next two indices contain the root’s children,
the next four indices contain the children of the root’s children,
and so on.

<img src="/assets/images/comp2521/heap.png" alt="heap" width="100%"/>

For an item at index $i$:
* Its left child is located at index $2i$
* Its right child is located at index $2i + 1$
* Its parent is located at index $\lfloor i/2 \rfloor$

Note: the following operations focuses on max heaps

### **Binary Heap Insertion**
***

Insertion is a two-step process:
1. Add new item at next available position on bottom level (i.e., after the last item)
  * New item may violate the heap property
2. **Fix up**: While new item is greater than its parent (and not at the root), swap with its parent
  * This re-organises items along the path to the root and restores the heap
property

Cost of insertion:
* Add new item after last item ⇒ $O(1)$
* Fix up considers one item on each level in the worst case
* Heap is a complete tree ⇒ $O(\log n)$ levels
* Therefore, worst-case time complexity is $O(\log n)$

### **Binary Heap Deletion**
***

Deletion is a three-step process:
1. Replace root item with last item
  * Last item = bottom-most, rightmost item
  * Let this item be $i$
2. Remove last item
3. **Fix down**: While $i$ is less than its greater child, swap it with its greater
child 
  * This restores the heap property

Cost of deletion:
* Replace root by item at end of array ⇒ $O(1)$
* Fix down considers two items on each level in the worst case
* Heap is a complete tree ⇒ $O(log n)$ levels
* Therefore, worst-case time complexity is $O(log n)$

### **Using Heaps for Priority Queues**
***

Now that we have learned heaps, we can use it to implement a more efficient priority queue.
* Insert: $O(\log n)$
* Delete: $O(\log n)$
* Peek: O(1)
* Is empty: O(1)

## **Heap Sort**
***

Heap sort is a sorting algorithm that uses a heap

Method:
* Build up a heap within the original array
  * This is called “heapify”
* Repeatedly delete from the heap
  * Each time an element is deleted, place it at the end of the heap

### **Heapify (Fix Up)**
***

* Take first element and treat as a heap of size 1
* Take next element and insert into the heap, which increases the size of the
heap by one
* Repeat for remaining elements

```
void heapify(Item items[], int size) {
  for (int i = 1; i < size; i++) {
    fixUp(items, i);
  }
}

void fixUp(Item items[], int i) {
  while (i > 0 && items[i] > items[(i - 1) / 2]) {
    swap(items, i, (i - 1) / 2);
    i = (i - 1) / 2;
  }
}
```

Analysis:
* Inserting into a heap is $O(\log n)$
* Therefore, inserting n items into an initially empty heap is
$O(\log 1 + \log 2 + \log 3 + . . . + \log n)$ = $O(\log n!)$ = $O(n \log n)$

### **Heapify (Fix Down)**
***

Heapify can be implemented more efficiently
by performing a fix down on every element in the
first half of the array in reverse (i.e., from right to left)

Examples are in the lecture slides.

```
void heapify(Item items[], int size) {
  for (int i = size / 2 - 1; i >= 0; i--) {
    fixDown(items, i, size - 1);
  }
}

void fixDown(Item items[], int i, int N) {
  while (2 * i + 1 <= N) {
    int j = 2 * i + 1;
    if (j < N && items[j] < items[j + 1]) j++;
    if (items[i] >= items[j]) break;
    swap(items, i, j);
    i = j;
  }
}
```

This implementation of heapify is O(n).

### **De-Heapify**
***

After the array has been heapified,
repeatedly delete from the heap, each time
placing the deleted item at the end of the heap.

```
void deheapify(Item items[], int size) {
  while (size > 1) {
    swap(items, 0, size - 1);
    size--;
    fixDown(items, 0, size - 1);
  }
}
```

Analysis:
* Deleting from a heap is $O(\log n)$
* Therefore, deleting all items from a heap of size n is
$O(\log n + \log(n − 1) + \log(n − 2) + . . . + \log 1) = O(\log n!) = O(n \log n)$

### **Analysis of Heap Sort**
***

* Heapify is $O(n)$
* De-heapify is $O(n \log n)$
* Therefore, heap sort is $O(n \log n)$

Properties:

**Unstable**: Due to long-range swaps<br>
**Non-adaptive**: $O(n \log n)$ average case and if array is sorted<br>
**In-place**: Sorting is done within original array; does not use temporary arrays