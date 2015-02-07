var createHeap = require('../simpleheap')

//Create a new heap with a maximum capacity of 10 items
var heap = createHeap(10)

for(var i=0; i<10; ++i) {
  //put() adds an item to the heap or changes a weight
  heap.put(
    i,               // item
    Math.pow(i-5,2)) // weight
}

for(var i=0; i<10; ++i) {
  //You can access the top item in the heap with minItem()/minWeight()
  console.log(heap.top(), heap.weight())

  //pop() when called with no arguments removes the top item
  heap.pop()
}

//You can change the weights of an item by calling upsert again
for(var i=0; i<10; ++i) {
  heap.put(i, Math.random())
}
for(var i=9; i>=0; --i) {
  heap.put(i, i)
}

//pop(item) takes an item out of the heap
for(var i=0; i<10; i+=2) {
  heap.pop(i)
}

//Remove all remaining items from heap
while(heap.size > 0) {
  console.log(heap.pop())
}

//When you are all done with the heap, it is good practice to dispose it so its memory
//can be reused by the typedarray pool
heap.dispose()