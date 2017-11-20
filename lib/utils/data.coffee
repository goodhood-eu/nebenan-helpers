isSameHash = (hash1, hash2) -> JSON.stringify(hash1) is JSON.stringify(hash2)

isSameArray = (source, target, options = {}) ->
  return true if source is target
  return false if not Array.isArray(source) or not Array.isArray(target)
  return false if source.length isnt target.length

  sortedSource = source.slice()
  sortedTarget = target.slice()

  if not options.sorted
    sortedSource.sort()
    sortedTarget.sort()

  for item, index in sortedSource
    return false if sortedTarget[index] isnt item

  true

isSameCollection = (source, target) ->
  return true if source is target
  return false if not Array.isArray(source) or not Array.isArray(target)
  isSameArray(source.map(JSON.stringify), target.map(JSON.stringify), sorted: true)

arrayToHash = (array, selector) ->
  result = {}
  for item in array
    key = if selector then item[selector] else item
    result[key] = true

  result

arrayToObject = (array, keyField = 'id') ->
  result = {}
  for item in array
    result[item[keyField]] = item
  result

arrayToChunks = (array, count) ->
  return [] if not array or not count
  return [array.slice()] if count is 1

  chunks = []
  length = array.length
  size = Math.ceil(length / count)
  step = 0

  for [0...count]
    chunks.push(array.slice(step, step + size))
    step += size

  chunks

setField = (obj, keypath, value) ->
  field = obj
  keypath = keypath.split('.')

  while keypath.length > 1
    field = field[keypath.shift()] ?= {}
  field[keypath[0]] = value

  obj

isModelEmpty = (model, skip) ->
  skipHash = arrayToHash(skip) if skip

  for key, value of model
    continue if skipHash and skipHash[key]
    return false if value
  true

reverse = (arr) ->
  arr.slice().reverse()

gatherArrays = (object, fields) ->
  return [] if not object or not fields
  fields.reduce(((acc, field) -> acc.concat(object[field])), [])

has = (args...) -> Object.prototype.hasOwnProperty.call(args...)

hashToArray = (hash) ->
  for key, value of hash
    continue if not value
    key

concatItems = (items, key) ->
  callback = (acc, item) ->
    arr = if key then item[key] else item
    acc.concat(arr)

  items.reduce(callback, [])

arrayOf = (number) -> Array.from(new Array(number))

formatQuery = (object) ->
  return null if not object

  result = {}

  for key, value of object
    if Array.isArray(value)
      result[key] = value.join(',')
    else
      result[key] = value if typeof value isnt 'object'

  result

module.exports = {
  isSameHash
  isSameArray
  isSameCollection
  arrayToHash
  arrayToObject
  arrayToChunks
  setField
  isModelEmpty
  reverse
  gatherArrays
  has
  hashToArray
  concatItems
  arrayOf
  formatQuery
}
