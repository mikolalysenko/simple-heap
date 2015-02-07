var createHeap = require('../simpleheap')
var heap = createHeap(10)
for(var i=0; i<10; ++i) {
  heap.push(i, Math.pow(i-5,2))
}
for(var i=0; i<10; ++i) {
  console.log(heap.minItem(), heap.minWeight())
  heap.pop()
}