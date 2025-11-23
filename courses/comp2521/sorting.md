---
layout: course
title: COMP2521 - Sorting
permalink: /courses/comp2521/sorting
toc: false
---

<!-- to preview: bundle exec jekyll serve --livereload -->

## **Introduction**
***

Sorting involves arranging a collection of items in order

Three main cases to consider for input order:
* Random order
* Sorted order
* Reverse-sorted order

When analysing sorting algorithms, we consider:
* $n$: the number of items (hi - lo + 1)
* $C$: the number of comparisons between items
* $S$: the number of times items are swapped 

## **Properties**
***

Properties:
* Stability
  * A stable sort preserves the relative order of items with equal keys.
* Adaptability
  * An adaptive sorting algorithm takes advantage of existing order in its input
  * Allows sorted or nearly-sorted inputs to be sorted **much** quicker than other inputs (e.g. from O(n log n) to O(n))
  * But, just because a sorting algorith sorts sorted input faster than it sorts random/reverse-sorted input,
does not mean that it is adaptive. (Could be O(n log n) on random input, but still O(n log n) on sorted input, but slightly faster)
* In-place
  * Sorts the data within the original structure, without using temporary arrays

## **Elementary Sorting Algorithms**
***

### **Selection Sort**
***

Method:
* Find the smallest element, swap it with the first element
* Find the second-smallest element, swap it with the second element
* …
* Find the second-largest element, swap it with the second-last element

Time complexity:

Best case: $O(n^2)$<br>
Average case: $O(n^2)$<br>
Worst case: $O(n^2)$<br>

Properties:

**Unstable**: due to long-range swaps<br>
**Non-adaptive**: performs same steps, regardless of sortedness of original array <br>
**In-place**: does not use temporary arrays

### **Bubble Sort**
***

Method:
* Make multiple passes from left (lo) to right
* On each pass, swap any out-of-order adjacent pairs
* Elements “bubble up” until they meet a larger element
* Stop if there are no swaps during a pass
  * This means the array is sorted

Time complexity:

Best case: $O(n)$ => When array is already sorted, only a single pass required <br>
Average case: $O(n^2)$<br>
Worst case: $O(n^2)$<br>

Properties:

**Stable**: Swappings are between adjacent elements only<br>
**Adaptive**: Bubble sort is $O(n^2)$ on average, $O(n)$ if input array is sorted <br>
**In-place**: does not use temporary arrays

### **Insertion Sort**
***

Method:
* Take first element and treat as sorted array (of length 1)
* Take next element and insert into sorted part of array so that order is
preserved
  * This increases the length of the sorted part by one
* Repeat for remaining elements

Time complexity:

Best case: $O(n)$ => When array is already sorted <br>
Average case: $O(n^2)$<br>
Worst case: $O(n^2)$<br>

Properties:

**Stable**: Elements are always inserted to the right of any equal elements<br>
**Adaptive**: Insertion sort is $O(n^2)$ on average, $O(n)$ if input array is sorted <br>
**In-place**: does not use temporary arrays

### **Summary of Elementary Sorts**
***

<img src="/assets/images/comp2521/elementarysortsummary.png" alt="Elementary Sort Summary" width="100%"/>
