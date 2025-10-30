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

```
dijkstraSSSP(G, src):
    Input: graph G, source vertex src

    create dist array, initialised to inf
    create a pred array, initialised to -1
    create vSet containing all vertices of G

    dist[src] = 0
    while vSet is not empty:
        find vertex  v in vSet such that dist[v] is minimal
        remove v from vSet
        for each edge (v, w, weight) in G:
            if dist[v] + weight < dist[w]:
                dist[w] = dist[v] + weight
                pred[w] = v
```

The shortest path from the source vertex to any other vertex
can be constructed by tracing backwards through the predecessor array
(like for BFS)

The set of vertices can be implemented in different ways:
1. Visited array
2. Explicit array/list of vertices
3. Priority queue

Visited array implementation:
* Similar to visited array in BFS/DFS
* Array of $V$ booleans, initialised to false
* After exploring vertex $v$, set $visited[v]$ to true
* At the start of each iteration, find vertex $v$ such that $visited[v]$ is false and $dist[v]$ is minimal $\Rightarrow O(V)$

Array/list of vertices implementation:
* Store all vertices in an array/linked list
* After exploring vertex $v$, remove $v$ from array/linked list
* At the start of each iteration, find vertex in array/list such that dist[v] is minimal $\Rightarrow O(V)$

Priority queue implementation:
* Use priority queue to store vertices, use distance to vertex as priority (smaller distance = higher priority)
* A priority queue implementation has $O(\log n)$ insert and delete

Analysis:
* Boolean array & Array/list of vertices $\Rightarrow O(V^2)$
* Priority queue $\Rightarrow O(E + V \log V)$

Other shortest path algorithms:
* Floyd-Warshall Algorithm
  * All-pairs shortest path
  * Works for graphs with negative weights
* Bellman-Ford Algorithm
  * Single-source shortest path
  * Works for graphs with negative weights
  * Can detect negative cycles

## **Minimum Spanning Trees**

A **spanning tree** of an undirected graph $G$ is a subgraph of $G$ that contains all vertices of $G$,
that is connected and contains no cycles

A **minimum spanning tree** of an undirected weighted graph $G$ is a spanning tree of $G$ that has
minimum total edge weight among all spanning trees of $G$

## **Kruskal's Algorithm**

Algorithm:
1. Start with an empty graph
    * With same vertices as original graph
2. Consider edges in increasing weight order
    * Add if it does not form a cycle in the MST
3. Repeat until $V-1$ edges have been added

```
kruskalMst(G):
    Input: graph G with V vertices
    Output: minimum spanning tree of G

    mst = empty graph with V vertices
    sortedEdges = sort edges of G by weight

    for each edge (v, w, weight) in sortedEdges:
        if there is no path between v and w in mst:
            add edge (v, w, weight) to mst

        if mst has V - 1 edges:
            return mst

    no mst
```

Time complexity: $O(E \log V)$

## **Prim's Algorithm**

Algorithm:
1. Start with an empty graph
2. Start from any vertex, add it to the MST
3. Choose cheapest edge s-t such that:
    * s has not been added to the MST, and
    * t has not been added to the MST
   and add this edge and the vertex t to the MST
4. Repeat previous step until V - 1 edges have been added
    * Or until all vertices have been added

```
primMst(G):
	Input:  graph G with V vertices
	Output: minimum spanning tree of G

	mst = empty graph with V vertices
	usedV = {0}
	unusedE = edges of G
	while |usedV| < V :
		find cheapest edge e (s, t, weight) in unusedE such that
			s in usedV and t not in usedV

		add e to mst
		add t to usedV
		remove e from unusedE

	return mst
```

Time complexity: $O(E + V \log V)$ (with Fibonacci heap)