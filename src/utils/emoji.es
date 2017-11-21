import { emojiRegex, shortnameRegex } from '../emoji';

const singleEmojiRegex = new RegExp(`^(${shortnameRegex}|${emojiRegex})$`);

export const isSingleEmoji = (string) => {
  if (typeof string !== 'string' || !string) return false;
  return singleEmojiRegex.test(string.trim());
};
