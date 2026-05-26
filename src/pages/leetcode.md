---
layout: ../layouts/Layout.astro
title: Leetcode Cheat Sheet
---
## **Python Leetcode Cheat Sheet**
Syntax errors no more!

## **List**
***
### Add & Remove
***

```python
lst = []
lst.append(x)
lst.pop()
lst.remove(x)
```

## **Dictionary**
***
AKA HashMap

Basics
```python
d = {}                # empty
d = {"a": 1, "b": 2}
d["a"]                # get (KeyError if missing)
d.get("a")            # get (None if missing)
d.get("a", 0)         # get with default
d["a"] = 10           # set / update
del d["a"]            # delete key
"a" in d              # key exists?
```

Iterating
```python
d.keys()              # all keys
d.values()            # all values
d.items()             # (key, value) pairs
for k, v in d.items(): ...
```

### defaultdict
***

```python
from collections import defaultdict
d = defaultdict(int)    # missing key -> 0
d = defaultdict(list)   # missing key -> []
d = defaultdict(set)    # missing key -> set()
d["x"] += 1             # no KeyError
```

## counter
***
```python
from collections import Counter
c = Counter("aabbbc")    # {'b':3,'a':2,'c':1}
c = Counter(nums)        # works on any iterable
c["a"]                   # count (0 if missing)
```

## **Set**
***

Basics
```python
s = set()              # empty (NOT s = {} - that's a dict)
s = {1, 2, 3}
s = set([1, 2, 2, 3])  # from iterable, dupes removed
x in s                 # membership - O(1)
len(s)
```

### Add & Remove
***
```python
s.add(x)              # add (no-op if exists)
s.remove(x)           # remove (KeyError if missing)
s.discard(x)          # remove (safe, no error)
s.clear()
```

## **Stack & Queue**
***

### Stack
***
Python lists can be used as a stack 
```python
s = []
s.append(x)     # push
s.pop()         # pop
s[-1]           # peek top
len(s) == 0     # is empty
```

### Queue
***
Use `deque` from `collections`
```python
from collections import deque
q = deque()
q.append(x)     # enqueue (back)
q.popleft()     # dequeue (front)
q[0]            # peek front
q[-1]           # peek back
len(q) == 0     # is empty
```

## **Heap**
***

Basics - in Python, min heap only
```python
import heapq
h = []
heapq.heappush(h, x)     # push - O(log n)
heapq.heappop(h)         # pop smallest - O(log n)
h[0]                     # peek smallest - O(1)
len(h) == 0              # is empty

h = [3, 1, 4, 1, 5]      # Heapify a list
heapq.heapify(h)         # in-place, O(n)
```

Max-heap trick (negate values)
```python
heapq.heappush(h, -x)    # push negated
-heapq.heappop(h)        # pop & negate back
-h[0]                    # peek max
```