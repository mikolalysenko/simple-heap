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

  
}


tape('simple-heap', function(t) {


  t.end()
})