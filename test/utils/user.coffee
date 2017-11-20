{ assert } = require('chai')
{ ACHIEVEMENT_BEN } = require('../lib/constants/enum')

{
  getPicturePlaceholder
  getPicture
  getShortName
  formatBirthday
  isActiveUser
} = require('../lib/utils/user')


describe 'modules/utils/user', ->
  it 'getPicturePlaceholder', ->
    user = id: 1
    picturePlaceholder = getPicturePlaceholder(user)
    secondPicturePlaceholder = getPicturePlaceholder(user)

    assert.equal(picturePlaceholder, secondPicturePlaceholder, 'return the same url on each call')

  it 'getPicture', ->
    userWithPic = id: 1, photo_url: 'avatar.jpg'

    userWithoutPic = id: 2
    userWithoutPicPlaceholder = getPicturePlaceholder(userWithoutPic)

    assert.equal(getPicture(userWithPic), 'avatar.jpg', 'get photo_url field')
    assert.equal(getPicture(userWithoutPic), userWithoutPicPlaceholder, 'return placeholder if there is no image')

  it 'getShortName', ->
    user =
      firstname: 'Petya'
      lastname: 'Ivanov'

    assert.equal(getShortName(user), 'Petya I.', 'return firstname and first letter of lastname')

  it 'formatBirthday', ->
    user =
      birth_day: 12
      birth_month: 3
      birth_year: 1995

    hiddenYearUser =
      birth_day: 12
      birth_month: 3
      birth_year: 1995
      privacy_show_year_of_birth: false

    assert.equal(formatBirthday(user), '12. March 1995')
    assert.equal(formatBirthday(hiddenYearUser), '12. March')

  it 'isActiveUser', ->
    assert.isFalse(isActiveUser({}), 'no achievements prop')
    assert.isFalse(isActiveUser(achievements: []), 'not achievements')
    assert.isTrue(isActiveUser(achievements: [ACHIEVEMENT_BEN]), 'user has BEN achievement')
