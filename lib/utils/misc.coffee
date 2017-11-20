moment = require('moment')
unsafeFileCharsRegex = /[\\\/:*?"'<>|]/g

escapeFileName = (filename) -> filename.replace(unsafeFileCharsRegex, '_')
invoke = (fn, args...) -> fn(args...) if typeof fn is 'function'

module.exports = {
  escapeFileName
  invoke
}
