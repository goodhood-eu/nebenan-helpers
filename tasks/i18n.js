const fs = require('fs');
const serialize = require('serialize-javascript');

const { logError } = require('./utils');
const locales = require('../i18n');

const process = (language, destination) => {
  if (!language || !destination) return logError('Missing required arguments');
  if (!locales[language]) return logError(`${language} file not present`);

  const content = `var __appLocale__=${serialize(locales[language])};`;

  const complete = (error) => {
    if (error) return logError(error);
  };

  fs.writeFile(destination, content, complete);
};

module.exports = process;
