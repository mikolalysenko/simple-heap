simple-heap
===========
A no-frills binary heap with finite double precision weights and unique integer items from a finite universe.

# Example

```javascript
var createHeap = require('simple-heap')
var heap = createHeap(10)

for(var i=0; i<10; ++i) {
  //upsert() adds an item to the heap or changes a weight
  heap.upsert(
    i,               // item
    Math.pow(i-5,2)) // weight
}

for(var i=0; i<10; ++i) {
  //You can access the top item in the heap with minItem()/minWeight()
  console.log(heap.minItem(), heap.minWeight())

  //remove() when called with no arguments pops the top item
  heap.remove()
}

//You can change the weights of an item by calling upsert again
for(var i=0; i<10; ++i) {
  heap.upsert(i, Math.random())
}
for(var i=9; i>=0; --i) {
  heap.upsert(i, i)
}

//remove(item) takes an item out of the heap
for(var i=0; i<10; i+=2) {
  heap.remove(i)
}

//Remove all remaining items from heap
while(heap.size > 0) {
  console.log(heap.remove())
}

//When you are all done with the heap, it is good practice to dispose it so its memory
//can be reused by the typedarray pool
heap.dispose()
```

Output:

```
5 0
4 1
6 1
7 4
3 4
2 9
8 9
9 16
1 16
0 25
1
5
7
3
9
```

# Install

```
npm i simple-heap
```

# API

## Constructor

#### `var heap = require('simple-heap')(capacity)`
Creates a new simple heap. 

* `capacity` is the maximum number of items in the heap.

**Returns** A new heap data structure

**Time complexity** `O(capacity)`

**Space complexity** `O(capacity)`

## Properties

#### `heap.size`
The number of elements in the heap

#### `heap.capacity`
The maximum capacity of the heap

## Methods

#### `heap.upsert(item, weight)`
If `item` is not in the heap, then adds it to the heap with the given weight.  Otherwise, if `item` is in the `heap` then the weight of item is changed to `weight`

* `item` is an integer between `0` and `heap.capacity` representing the key of the item
* `weight` is the weight to assign to `item` in the queue

**Time complexity** `O(log(heap.size))`

#### `heap.remove([item])`
Removes `item` from the heap, or if not specified removes the smallest item.

* `item` is an optional argument, which if passed is the item to remove otherwise the top of the heap is removed.

**Returns** The item which was removed or `-1` if the heap is empty

**Time complexity** `O(log(heap.size))`

#### `heap.weight(item)`

**Returns** The weight of `item`

**Time complexity** `O(1)`

#### `heap.minWeight()`
**Returns** The weight of the top item or `NaN` if the heap is empty

**Time complexity** `O(1)`

#### `heap.minItem()`
**Returns** The top item or `-1` if the heap is empty

**Time complexity** `O(1)`

#### `heap.resize(ncapacity)`
Resizes the heap to `capacity`

* `ncapacity` is the new heap capacity, must be larger than `heap.size`.  Takes `O(c)

**Time complexity** `O(ncapacity)`

#### `heap.clear()`
Removes all items from the heap.  Takes `O(size)` time

#### `heap.dispose()`
Releases all resources associated with the heap.

**Time complexity** `O(1)`

# License
(c) 2015 Mikola Lysenko. MIT License