import { assert } from 'chai';
import users from '../../../scaffolding/users';
import { TAGS_SKILLS, TAGS_INTERESTS } from '../lib/constants/tags';

import {
  isEmptyArrayFields,
  isTagsPicked,
  hasImage,
  hasStrangeFields,
  isProfileFilled,
  isPilotHood,
  isPostcardRequested,
  isInHouseGroup,
  isEmptySurroundings,
  isSurroundingsVisible,
  isDisabledSurroundings,
  getTagsHash,
} from '../lib/utils/profile';


const filledTags = {};
const emptyTags = {};

TAGS_SKILLS.concat(TAGS_INTERESTS).forEach((tag) => {
  filledTags[tag] = ['blablabla'];
  emptyTags[tag] = [];
});

describe('modules/utils/profile', () => {
  it('isEmptyArrayFields', () => {
    const empty = {
      a: [],
      b: null,
      c: '',
    };

    const filled = {
      a: [1],
    };

    assert.isTrue(isEmptyArrayFields(empty, ['a', 'b', 'c']), 'true if all fields are empty');
    assert.isFalse(isEmptyArrayFields(filled, ['a', 'b', 'c']), 'false if at least one field has items');
  });

  it('isTagsPicked', () => {
    assert.isTrue(isTagsPicked({ tags: filledTags }), 'check interests and skills scopes');
    assert.isFalse(isTagsPicked({ tags: emptyTags }), 'false if tags are not filled');
    assert.isFalse(isTagsPicked({ tags: null }), 'false if tags is null');
  });

  it('hasImage', () => {
    assert.isTrue(hasImage({ photo_url: 'avatar.jpg' }), 'check photo url existing');
    assert.isFalse(hasImage({ photo_url: '' }), 'false if photo url is empty');
    assert.isFalse(hasImage({ photo_url: null }), 'false if photo url is null');
  });

  it('hasStrangeFields', () => {
    assert.isTrue(hasStrangeFields({ status: { strange_fields: ['name'] } }), 'check strange fields existing');
    assert.isFalse(hasStrangeFields({ status: { strange_fields: [] } }), 'false if there are no strange fields');
  });

  it('isProfileFilled', () => {
    const filledProfile = {
      photo_url: 'avatar.jpg',
      tags: filledTags,
    };

    const unfilledProfiles = [
      { photo_url: null, tags: filledTags },
      { photo_url: 'avatar.jpg', tags: emptyTags },
      { photo_url: null, tags: null },
    ];

    assert.isTrue(isProfileFilled(filledProfile), 'profile has photo url and filled tags');

    unfilledProfiles.forEach((profile) => {
      assert.isFalse(isProfileFilled(profile), 'false if profile has not photo url or tags');
    });
  });

  it('isPostcardRequested', () => {
    assert.isTrue(isPostcardRequested({ status: { is_postcard_verification_pending: true } }), 'is pending verification');
    assert.isFalse(isPostcardRequested({ status: { is_postcard_verification_pending: false } }), 'no pending verification');
  });

  it('isInHouseGroup', () => {
    const counters = { house_group_user_ids: [1, 2, 3] };

    assert.isFalse(isInHouseGroup({}, { id: 1 }), 'empty counters doesn\'t crash');
    assert.isTrue(isInHouseGroup(counters, { id: 1 }), 'user in house group');
    assert.isFalse(isInHouseGroup(counters, { id: 8 }), 'user not in house group');
  });

  it('isEmptySurroundings', () => {
    assert.isTrue(isEmptySurroundings({ possible_external_hood_ids: [] }), 'empty surroundings');
    assert.isFalse(isEmptySurroundings({ possible_external_hood_ids: [1, 2, 3] }), 'has surroundings');
  });

  it('isSurroundingsVisible', () => {
    assert.isTrue(isSurroundingsVisible({ external_hood_ids: [1, 2, 3] }), 'visible surroundings');
    assert.isFalse(isSurroundingsVisible({ external_hood_ids: [] }), 'invisible surroundings');
  });

  it('isDisabledSurroundings', () => {
    assert.isFalse(isDisabledSurroundings({ external_hood_ids: [], possible_external_hood_ids: [] }), 'empty surroundings, nothing selected');
    assert.isTrue(isDisabledSurroundings({ external_hood_ids: [], possible_external_hood_ids: [123] }), 'has surroundings, nothing selected');
    assert.isFalse(isDisabledSurroundings({ external_hood_ids: [1], possible_external_hood_ids: [1, 2, 3] }), 'has surroundings, has selected');
  });

  it('isPilotHood', () => {
    assert.isTrue(isPilotHood(users.pilotHoodFullAccess), 'pilot hood');
    assert.isFalse(isPilotHood(users.withFullAccess), 'opened hood');
  });

  it('getTagsHash', () => {
    const tags = {
      interests: ['lada', 'sunflower seeds', 'adidas', 'vodka'],
      skilss: ['steal', 'squat', 'spit', 'vodka'],
    };

    const hash = {
      lada: true,
      'sunflower seeds': true,
      adidas: true,
      steal: true,
      squat: true,
      spit: true,
      vodka: true,
    };

    assert.isObject(getTagsHash({ tags: null }), 'returns empty hash when no tags in profile');
    assert.deepEqual(getTagsHash({ tags }), hash, 'transform tags object to flat hash');
  });
});
