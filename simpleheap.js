'use strict'

module.exports = createSimpleHeap

var pool = require('typedarray-pool')

function SimpleHeap(items, weights, locations, size, capacity) {
  this._items     = items
  this._weights   = weights
  this._locations = locations
  this.size       = size
  this.capacity   = capacity
}

var proto = SimpleHeap.prototype

function heapUp(heap, idx) {
  var locs    = heap._locations
  var items   = heap._items
  var weights = heap._weights
  var size    = heap._size
  var w = weights[idx]
  var x = items[idx]
  while(idx > 0) {
    var p = idx >>> 1
    var pw = weights[p]
    if(pw <= w) {
      break
    }
    var px = items[p]
    weights[idx] = pw
    items[idx] = px
    locs[px] = idx
    idx = p
  }
  weights[idx] = w
  items[idx]   = x
  locs[x]      = idx
}

function heapDown(heap, x, w) {
  var locs    = heap._locations
  var items   = heap._items
  var weights = heap._weights
  var size    = heap.size
  var idx     = 0

outer:
  while(true) {
    var cidx = 2 * idx
    for(var j=0; j<2; ++j) {
      if(++cidx >= size) {
        break outer
      }
      var cw = weights[cidx]
      if(cw < w) {
        var cx = items[cidx]
        weights[idx] = cw
        items[idx]   = cx
        locs[cx]     = idx
        idx = cidx
        continue outer
      }
    }
    break
  }
  weights[idx] = w
  items[idx]   = x
  locs[x]      = idx
}

function heapSwap(heap, a, b) {
  var locs    = heap._locations
  var items   = heap._items
  var weights = heap._weights
  var size    = heap._size
  var itemA   = items[a]
  var itemB   = items[b]
  var weightA = weights[a]
  var weightB = weights[b]
  items[a]    = itemB
  items[b]    = itemA
  locations[itemA] = b
  locations[itemB] = a
  weights[a] = weightB
  weights[b] = weightA
}

proto.clear = function() {
  var count = this.size
  var locs  = this._locations
  for(var i=0; i<count; ++i) {
    locs[i] = -1
  }
  this.size = 0
}

proto.push = function(item, weight) {
  var size    = this.size
  var locs    = this._locations
  var items   = this._items
  var weights = this._weights
  var prevLoc = locs[item]
  if(prevLoc >= 0) {
    var prevWeight = weights[prevLoc]
    if(weight < prevWeight) {
      weights[prevLoc] = weight
      heapUp(this, prevLoc)
    } else if(weight > prevWeight) {
      weights[prevLoc] = -Infinity
      heapUp(this, prevLoc)
      heapSwap(this, 0, size-1)
      weights[size-1] = weight
      heapUp(this, size-1)
    }
  } else {
    locs[item]    = size
    items[size]   = item
    weights[size] = weight
    this.size     += 1
    heapUp(this, size)
  }
}

proto.pop = function() {
  var size = this.size
  if(size <= 0) {
    return -1
  }
  var locs    = this._locations
  var items   = this._items
  var weights = this._weights
  var x = items[0]
  locs[x] = -1
  if(size <= 1) {
    this.size -= 1
    return x
  }
  var lastIdx = size - 1
  this.size   = lastIdx
  heapDown(this, items[lastIdx], weights[lastIdx])
  return x
}

proto.remove = function(item) {
  this.push(item, -Infinity)
  this.pop()
}

proto.weight = function(item) {
  var loc = this._locations[item]
  if(loc < 0) {
    return NaN
  }
  return this._weights[loc]
}

proto.minWeight = function() {
  if(this.size > 0) {
    return this._weights[0]
  }
  return NaN
}

proto.minItem = function() {
  if(this.size > 0) {
    return this._items[0]
  }
  return -1
}


proto.dispose = function() {
  pool.free(this._items)
  pool.free(this._weights)
  pool.free(this._locations)
}

proto.resize = function(ncapacity) {
  if(ncapacity < this.size) {
    return
  }
  if(ncapacity === capacity) {
    return
  }
  var items      = this._items
  var weights    = this._weights
  var locations  = this._locations
  var nitems     = pool.mallocInt32(ncapacity)
  var nweights   = pool.mallocDouble(ncapacity)
  var nlocations = pool.mallocDouble(nlocations)
  var size       = this.size
  for(var i=0; i<size; ++i) {
    nitems[i] = items[i]
    nweights[i] = weights[i]
    nlocations[i] = locations[i]
  }
  for(var i=size; i<ncapacity; ++i) {
    nlocations[i] = -1
  }
  pool.free(items)
  pool.free(weights)
  pool.free(locations)
  this._items     = nitems
  this._weights   = nweights
  this._locations = nlocations
  this.capacity   = ncapacity
}

function createSimpleHeap(maxItems) {
  var locs = pool.mallocInt32(maxItems)
  for(var i=0; i<maxItems; ++i) {
    locs[i] = -1
  }
  return new SimpleHeap(
    pool.mallocInt32(maxItems),
    pool.mallocDouble(maxItems),
    locs,
    0,
    maxItems)
}