import { assert } from 'chai';

import {
  isSingleEmoji,
} from '../../src//utils/emoji';


describe('modules/utils/emoji', () => {
  it('isSingleEmoji', () => {
    const singleEmoji = ':banana:';
    const singleUnicode = '🤷🏻‍♂️';
    const singleLetter = 'x';
    const singleEmojiWithSpace = '    :penis:   ';
    const randomMessage = 'you my good Sir are a :penis:';
    const randomMessage2 = 'you my good Sir are a 💩';

    assert.isFalse(isSingleEmoji(), 'handles empty arguments');
    assert.isFalse(isSingleEmoji(''), 'handles empty string');
    assert.isTrue(isSingleEmoji(singleEmoji), 'detects single emoji');
    assert.isTrue(isSingleEmoji(singleUnicode), 'detects single unicode emoji');
    assert.isTrue(isSingleEmoji(singleEmojiWithSpace), 'detects malformed single emoiji');
    assert.isFalse(isSingleEmoji(singleLetter), 'single letter');
    assert.isFalse(isSingleEmoji(randomMessage), 'doesn\'t report false positives');
    assert.isFalse(isSingleEmoji(randomMessage2), 'doesn\'t report false positives');
  });
});
