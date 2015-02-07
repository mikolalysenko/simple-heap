var createHeap = require('../simpleheap')
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