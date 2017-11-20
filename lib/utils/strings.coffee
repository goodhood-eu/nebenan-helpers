punycode = require('punycode')
SHORTENED_STRING_TOKEN = '…'

punctuationRegex = /[\s\:\.,!\?"';\-–\(\)\[\]…]+$/

unicodeLength = (string) ->
  return 0 if not string or typeof string isnt 'string'
  punycode.ucs2.decode(string).length

shortenString = (string, limit = 10) ->
  return '' if not string or typeof string isnt 'string' or limit is 0
  decoded = punycode.ucs2.decode(string)
  return string if decoded.length < limit

  # working RTL: ...[lastIndex]|[cutoffIndex]...
  lastIndex = limit - 2
  cutoffIndex = limit - 1

  lastChar = decoded[lastIndex]
  cutoffChar = decoded[cutoffIndex]

  shortened = decoded.slice(0, cutoffIndex)

  # shouldn't end on ZWJ (\u200d)
  if lastChar is 8205
    shortened = shortened.slice(0, -1)

  # should't trim variations (\ufe0e|\ufe0f)
  else if cutoffChar is 65038 or cutoffChar is 65039
    shortened.push(cutoffChar)

  result = punycode.ucs2.encode(shortened).replace(punctuationRegex, '')
  result + SHORTENED_STRING_TOKEN

module.exports = { unicodeLength, shortenString }
