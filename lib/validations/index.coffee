moment = require('moment')
{ unicodeLength } = require('../utils/strings')
{ emojiRegex } = require('../emoji')

REGEX_EMAIL = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
REGEX_INT = /^\d+$/
REGEX_FLOAT = /^\d+(\.\d+)?$/
REGEX_PHONE = /^(?=.{2,50}$)[\/\-\.\(\)\+\s\d–]*\d{2,}[\/\-\.\(\)\+\s\d–]*$/
REGEX_ZIPCODE = /^\d{5}$/
REGEX_NAME = /^(?:[^\u0000-\u007F]|[a-zA-Z.'\s-]){2,40}$/
REGEX_EMOJI_CHAR = new RegExp(emojiRegex)

v = {}

v.isRequired = (value) ->
  return false if not value?
  return value.length isnt 0 if Array.isArray(value)

  switch typeof value
    when 'string'
      unicodeLength(value) isnt 0
    when 'object'
      JSON.stringify(value) isnt '{}'
    when 'boolean'
      value
    when 'number'
      true
    else
      Boolean(value)

v.isLength = (value = '', min = 0, max = Infinity) ->
  return false unless value?

  if Array.isArray(value)
    length = value.length
  else
    length = unicodeLength(value)

  max >= length >= min

v.isRegex = (value, regex) -> regex.test(value)
v.isEmail = (value) -> v.isRegex(value, REGEX_EMAIL)
v.isPhone = (value) -> v.isRegex(value, REGEX_PHONE)
v.isInt = (value) -> v.isRegex(value, REGEX_INT)
v.isNumber = (value) -> v.isRegex(value, REGEX_FLOAT)
v.isEqual = (value, prop) -> value is prop
v.isOneOf = (value, props...) -> value in props

# App specific - for unification purposes
v.isPassword = (value) -> v.isLength(value, 8)
v.isShortText = (value) -> v.isLength(value, 2, 250)
v.isLongText = (value) -> v.isLength(value, 2, 5000)
v.isEmailList = (value) ->
  return false unless value

  for email in value.split(/[\s\,]+/) # format: 'a@b.c, d@e.f f@g.h'
    return false unless v.isEmail(email)

  true

v.isDate = (value) -> moment(value, 'L', true).isValid()
v.isZipCode = (value) -> v.isRegex(value, REGEX_ZIPCODE)
v.isName = (value) -> v.isRegex(value, REGEX_NAME) and not v.isRegex(value, REGEX_EMOJI_CHAR)

module.exports = v
