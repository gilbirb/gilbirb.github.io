---
layout: course
title: COMP2521 - Graphs Algorithms
permalink: /courses/comp2521/graphalgos
toc: false
---

<!-- to preview: bundle exec jekyll serve --livereload -->

## **Digraph Algorithms**

### **Cycle Checking**

The idea is similar to undirected graphs, but:
* Undirected ignores edge to previous vertex, the fix is to not ignore the previous vertex.
* To properly detect a cycle, check if neighbour is already on the call stack

```
hasCycle(G):
    create visited array, initialised to false
    create onStack array, initialised to false
    
    for each vertex v in G:
        if visited[v] = false:
            if dfsHasCycle(G, v, visited, onStack):
                return true

    return false

dfsHasCycle(G, v, visited, onStack):
    visited[v] = true
    onStack[v] = true

    for each edge (v, w) in G:
        if onStack[w] = true:
            return true
        else if visited[w] = false:
            if dfsHasCycle(G, w, visited, onStack):
                return true

    onStack[v] = false
    return false
```

### **Transitive Closure**

Given a digraph $G$ it is potentially useful to know:
* Is vertex $t$ reachable from vertex $s$?

Idea:

Construct a $V \times V$ matrix that tells us whether there is a **path** (not edge)
from $s$ to $t$, for $s,t \in V$

This matrix is called the transitive closure (tc) matrix
(or reachability matrix)

$tc[s][t]$ is true if there is a path from $s$ to $t$, false otherwise

**Warshall's algorithm** uses transitivity to compute reachability,

If there is a path from $u$ to $v$, and a path from $v$ to $w$, then there is a path from $u$ to $w$

```
warshall(A):
    Input: n x n adjacency matrix A
    Output: n x n reachability matrix

    create tc matrix which is a copy of A

    for each vertex k in G: // from 0 to n - 1
        for each vertex s in G:
            for each vertex t in G:
                if tc[s][k] and tc[k][t]:
                    tc[s][t] = true

    return tc
```

Analysis:
* Time complexity: $O(V^3)$
* Space complexity: $O(V^2)$
* Benefit: checking reachability between vertices is now $O(1)$

### **Other Algorithms**

Strongly connected components:
* Kosaraju's algorithm
* Tarjan's algorithm

## **Dijkstra's Algorithm**

Dijkstra's algorithm finds the **shortest path** in a **weighed graph** with non-negative weights