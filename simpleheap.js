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
  var w       = weights[idx]
  var x       = items[idx]
  while(idx > 0) {
    var p  = (idx-1) >>> 1
    var pw = weights[p]
    if(pw <= w) {
      break
    }
    var px = items[p]
    weights[idx] = pw
    items[idx]   = px
    locs[px]     = idx
    idx          = p
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
  while(true) {
    var left  = 2*idx + 1
    var right = 2*(idx + 1)
    if(left >= size) {
      break
    }
    var cidx = left
    var cw   = weights[left]
    if(right < size) {
      var rw = weights[right]
      if(rw < cw) {
        cw   = rw
        cidx = right
      }
    }
    if(w <= cw) {
      break
    }
    var cx = items[cidx]
    weights[idx] = cw
    items[idx]   = cx
    locs[cx]     = idx
    idx = cidx
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
  locs[itemA] = b
  locs[itemB] = a
  weights[a]  = weightB
  weights[b]  = weightA
}

proto.clear = function() {
  var count = this.size
  var cap   = this.capacity
  var locs  = this._locations
  var items = this._items
  if(512 * count < this.capacity) {
    for(var i=0; i<count; ++i) {
      locs[items[i]] = -1
    }
  } else {
    for(var i=0; i<cap; ++i) {
      locs[i] = cap
    }
  }
  this.size = 0
}

proto.put = function(x, w) {
  x = x|0
  w = +w  
  var size    = this.size
  var locs    = this._locations
  var items   = this._items
  var weights = this._weights
  if(x < 0 || x >= locs.length) {
    return
  }
  var prevLoc = locs[x]
  if(prevLoc >= 0) {
    var prevWeight = weights[prevLoc]
    if(w < prevWeight) {
      weights[prevLoc] = w
      heapUp(this, prevLoc)
    } else if(w > prevWeight) {
      weights[prevLoc] = -Infinity
      heapUp(this, prevLoc)
      heapDown(this, x, w)
    }
  } else {
    locs[x]       = size
    items[size]   = x
    weights[size] = w
    this.size     += 1
    heapUp(this, size)
  }
}

proto.pop = function(x) {
  var size = this.size
  if(size <= 0) {
    return -1
  }
  var locs    = this._locations
  var items   = this._items
  var weights = this._weights
  if(typeof x === 'number') {
    x = x|0
    if(x < 0 || x >= locs.length) {
      return -1
    }
    var prevLoc = locs[x]
    if(prevLoc < 0) {
      return -1
    }
    weights[prevLoc] = -Infinity
    heapUp(this, prevLoc)
  } else {
    x = items[0]|0
  }
  locs[x] = -1
  var lastIdx = size - 1
  this.size   = lastIdx
  if(size <= 1) {
    return x
  }
  heapDown(this, items[lastIdx], weights[lastIdx])
  return x
}

proto.weight = function(x) {
  if(typeof x === 'number') {
    x = x|0
    if(x < 0 || x >= this._locations.length) {
      return NaN
    }
    var loc = this._locations[x]
    if(loc < 0) {
      return NaN
    }
    return this._weights[loc]
  } else if(this.size > 0) {
    return this._weights[0]
  } else {
    return NaN
  }
}

proto.top = function() {
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
    nitems[i]     = items[i]
    nweights[i]   = weights[i]
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