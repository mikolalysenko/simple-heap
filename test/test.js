'use strict'

var tape = require('tape')
var createHeap = require('../simpleheap')

function checkInvariant(t, heap) {
  var items      = heap._items
  var weights    = heap._weights
  var locations  = heap._locations
  var size       = heap.size
  var capacity   = heap.capacity

  t.equals(items.length, capacity, 'item cap')
  t.equals(weights.length, capacity, 'weight cap')
  t.equals(locations.length, capacity, 'location cap')
  t.ok(0 <= size && size <= capacity, 'size ok')

  if(size === 0) {
    t.equals(heap.top(), -1, 'top ok')
    t.ok(isNaN(heap.weight()), 'top weight ok')
  } else {
    t.equals(heap.top(), items[0], 'top ok')
    t.equals(heap.weight(), weights[0], 'top weight ok')
  }

  for(var i=0; i<capacity; ++i) {
    var loc = locations[i]
    if(locations[i] < 0) {
      continue
    }
    t.ok(0 <= loc && loc < size, 'checking location valid')
    t.equals(items[loc], i, 'checking location')
  }

  for(var i=0; i<size; ++i) {
    var x = items[i]
    var w = weights[i]

    t.ok(0 <= x && x < capacity, 'items[' + i + ']=' + x + ' ok')
    t.ok(!isNaN(w) && isFinite(w), 'weight valid double')
    t.equals(locations[x], i, 'location ok')
    t.equals(heap.weight(x), w, 'weight() consistent')

    var child = 2*i
    for(var j=0; j<2; ++j) {
      if(++child >= size) {
        break
      }
      var cx = items[child]
      var cw = weights[child]
      t.ok(w <= cw, 'weight less than child: ' + w + '<=' + cw)
    }
  }
}

tape('fuzz test', function(t) {
  for(var count=0; count<5; ++count) {
    var heap = createHeap(100)

    for(var i=0; i<100; ++i) {
      var w = Math.random()
      heap.put(i, w)
      t.equals(heap.weight(i), w)
      checkInvariant(t, heap)
    }
    
    for(var i=0; i<100; ++i) {
      var x = (Math.random()*100)|0
      var w = Math.random()
      heap.put(x, w)
      t.equals(heap.weight(x), w)
      checkInvariant(t, heap)
    }

    var sorted = []
    for(var i=0; i<100; ++i) {
      sorted.push(heap.weight())
      heap.pop()
      checkInvariant(t, heap)
    }
    for(var i=1; i<100; ++i) {
      t.ok(sorted[i-1] < sorted[i], 'compare:' + sorted[i-1] + '<=' + sorted[i])
    }
  }
  t.end()
})