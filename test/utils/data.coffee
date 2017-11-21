{ assert } = require('chai')

{
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
  hashToArray
  concatItems
  arrayOf
  formatQuery
} = require('../../src/utils/data')


describe 'modules/utils/data', ->
  it 'isSameHash', ->
    obj1 = { a:1, b: 2 }
    obj2 = { a:1, b: 2 }
    obj3 = { a:1, b: 3 }
    obj4 = { a:1, b: 2, c: 3 }

    assert.isTrue(isSameHash(obj1, obj1), 'same object match')
    assert.isTrue(isSameHash(obj1, obj2), 'object with same props match')
    assert.isFalse(isSameHash(obj1, obj3), 'object with diff values doesnt match')
    assert.isFalse(isSameHash(obj1, obj4), 'object with diff props doesnt match')

  it 'isSameArray', ->
    arr1 = [ 1, 2 ]
    arr2 = [ 2, 1 ]
    arr3 = [ 1, 3 ]
    arr4 = [ 1 ]
    arr5 = [ 1, 2, 3 ]

    assert.isTrue(isSameArray(arr1, arr1), 'same array match')
    assert.isTrue(isSameArray(arr1, arr2), 'array with same items match')
    assert.isFalse(isSameArray(arr1, arr2, sorted: true), 'array with different order doesn\'t match when option passed')
    assert.isFalse(isSameArray(arr1, arr3), 'array with diff values doesn\'t match')
    assert.isFalse(isSameArray(arr1, arr4), 'array with less values doesn\'t match')
    assert.isFalse(isSameArray(arr1, arr5), 'array with more values doesn\'t match')

  it 'isSameCollection', ->
    coll1 = [ { a: 1 }, { b: 2 } ]
    coll2 = [ { a: 1 }, { b: 2 } ]
    coll3 = [ { a: 2 }, { b: 2 } ]
    coll4 = [ { a: 1 } ]
    coll5 = [ { a: 1 }, { b: 2 }, { c: 3 } ]
    coll6 = [ { b: 2 }, { a: 1 }, { c: 3 } ]

    assert.isTrue(isSameCollection(coll1, coll1), 'same collections match')
    assert.isTrue(isSameCollection(coll1, coll2), 'similar collections match')
    assert.isFalse(isSameCollection(coll1, coll3), 'different collections don\'t match')
    assert.isFalse(isSameCollection(coll1, coll4), 'when less items doesn\'t match')
    assert.isFalse(isSameCollection(coll1, coll5), 'when more items doesn\'t match')
    assert.isFalse(isSameCollection(coll5, coll6), 'when order changed doesn\'t match')
    assert.isFalse(isSameCollection(null, coll1), 'one of collections missing - doesn\'t crash')
    assert.isFalse(isSameCollection(coll1, null), 'one of collections missing - doesn\'t crash')
    assert.isTrue(isSameCollection(null, null), 'both collections missing - ok')
    assert.isTrue(isSameCollection([], []), 'empty collections - ok')

  it 'arrayToHash', ->
    simpleArray = [1,2,3]
    objectArray = [{id: 1 }, {id: 2}, {id: 3}]

    hash = { 1: true, 2: true, 3: true }

    assert.deepEqual(arrayToHash(simpleArray), hash, 'convert simple array to hash')
    assert.deepEqual(arrayToHash(objectArray, 'id'), hash, 'convert object array to hash')

  it 'arrayToObject', ->
    idArray = [
      { id: 1, name: 'Halk' }
      { id: 2, name: 'Iron Man' }
      { id: 3, name: 'Captain America' }
    ]

    idObject =
      1: { id: 1, name: 'Halk' }
      2: { id: 2, name: 'Iron Man' }
      3: { id: 3, name: 'Captain America' }

    assert.deepEqual(arrayToObject(idArray), idObject, 'map by id')

    randomArray = [
      { os: 'windows', year: 2008 }
      { os: 'osx', year: 2012 }
      { os: 'linux', year: 2010 }
    ]

    randomObject =
      windows: { os: 'windows', year: 2008 }
      osx: { os: 'osx', year: 2012 }
      linux: { os: 'linux', year: 2010 }

    assert.deepEqual(arrayToObject(randomArray, 'os'), randomObject, 'map by specific key')

  it 'arrayToChunks', ->
    inputArray = [1..9]
    outputArray = [[1..3], [4..6], [7..9]]

    inputArray2 = [1..11]
    outputArray2 = [[1..4], [5..8], [9..11]]

    inputArray3 = [1..10]
    outputArray3 = [[1..4], [5..8], [9..10]]

    inputArray4 = [1..11]
    outputArray4 = [[1, 2], [3..4], [5..6], [7..8], [9..10], [11]]

    inputArray5 = [1..7]
    outputArray5 = [[1..4], [5..7]]

    assert.deepEqual(arrayToChunks(inputArray, 3), outputArray, 'splits arrays without ramainder properly')
    assert.deepEqual(arrayToChunks(inputArray2, 3), outputArray2, 'remainder tailing properly')
    assert.deepEqual(arrayToChunks(inputArray3, 3), outputArray3, 'shorter remainder tailing properly')
    assert.deepEqual(arrayToChunks(inputArray4, 6), outputArray4, 'split into many chunks properly')
    assert.deepEqual(arrayToChunks(inputArray5, 2), outputArray5, 'split into 2 chunks properly')
    assert.deepEqual(arrayToChunks(inputArray, 0), [], 'protects agains 0 chunks requested')
    assert.deepEqual(arrayToChunks(inputArray, 1), [inputArray], 'handles 1 chunk requested')

  it 'setField', ->
    obj = a: { b: 3 }
    empty = {}

    setField(obj, 'a.b', 5)
    setField(empty, 'd.c', 'hello')

    assert.equal(obj.a.b, 5, 'override existing value')
    assert.equal(empty.d.c, 'hello', 'set all path')

  it 'isModelEmpty', ->
    filledModel =
      hello: 'asdasd'
      world: ''
      its: null
      me: undefined

    model =
      tthis: ''
      sparta: null
      bitch: undefined

    modelWithExtraFields = Object.assign({ milk: 'drink', gun: 'shoot' }, model)

    assert.isFalse(isModelEmpty(filledModel), 'has at least one filled field')
    assert.isTrue(isModelEmpty(model), 'only empty fields')
    assert.isTrue(isModelEmpty(modelWithExtraFields, ['milk', 'gun']), 'skip fields')

  it 'reverse', ->
    arr = [1,2,3]

    assert.notEqual(reverse(arr), arr, 'do not modify original array')
    assert.deepEqual(reverse(arr), [3,2,1], 'reverse items')

  it 'gatherArrays', ->
    obj =
      a: [1, 2, 3]
      b: [4, 5]
      c: [6, 7, 8]

    assert.deepEqual(gatherArrays(obj, ['a', 'c']), [1,2,3,6,7,8], 'gather specified array field into one array')
    assert.deepEqual(gatherArrays(null, ['a', 'c']), [], 'return empty array if there is no object')
    assert.deepEqual(gatherArrays(obj, null), [], 'return empty array if field are not specified')

  it 'hashToArray', ->
    hash =
      a: true
      b: true
      c: false

    assert.deepEqual(hashToArray(hash), ['a', 'b'], 'collect keys only of positive values')
    assert.deepEqual(hashToArray({}), [], 'return empty array if hash is empty')

  it 'concatItems', ->
    simpleItems = [
      [1, 2, 3, 4]
      [5, 6, 7]
    ]

    hashItems = [
      { custom: [1, 2, 3, 4, 5] }
      { custom: [6, 7, 8] }
    ]

    simpleResult = concatItems(simpleItems)
    hashResult = concatItems(hashItems, 'custom')

    assert.deepEqual(simpleResult, [1, 2, 3, 4, 5, 6, 7], 'concat arrays');
    assert.deepEqual(hashResult, [1, 2, 3, 4, 5, 6, 7, 8], 'concat array props');

  it 'arrayOf', ->
    assert.isArray(arrayOf(), 'returns array')
    assert.equal(arrayOf(5).length, 5, 'correct length')

  it 'formatQuery', ->
    queryObj =
      str: '123'
      num: 123
      arr: [1,2,3]
      nested:
        str: '456'
        num: 456
        arr: [4,5,6]

    expected =
      str: '123'
      num: 123
      arr: '1,2,3'

    assert.isNull(formatQuery(), 'empty ok')
    assert.deepEqual(formatQuery(queryObj), expected, 'works correctly')
