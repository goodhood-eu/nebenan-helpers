const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const assetsPackage = 'emojione-assets';
const linkPrefix = 'emojis-v';
const linkRegex = new RegExp(`^${linkPrefix}`);

const versionRegex = new RegExp(`${assetsPackage}@(.+)\n`);
const imagesDir = path.resolve(`${__dirname}/../public/images`);
const linkPath = `../../node_modules/${assetsPackage}/png/`;

const cleanUp = () => {
  console.log('Cleaning up old symlinks');
  const currentLink = fs.readdirSync(imagesDir).filter((file) => linkRegex.test(file))[0];
  if (!currentLink) return Promise.resolve();
  return utils.run(`rm ${imagesDir}/${currentLink}`);
};

const getEmojiVersion = () => {
  console.log(`Extracting ${assetsPackage} version`);
  const executor = (resolve) => {
    const parseResult = (result) => {
      const matches = versionRegex.exec(result.output.trim());
      if (!matches) return utils.logError('Couldn\'t extract package version');
      resolve(matches[1]);
    };

    return utils.run('npm list --depth=0', { silent: true })
      .then(parseResult)
      // Even when npm list fails, it returns something. Fuck it, try to parse anyway.
      .catch(parseResult);
  };

  return new Promise(executor);
};

const createSymlimk = (version) => {
  console.log(`Linking ${assetsPackage}@${version}`);
  const linkName = `${linkPrefix}${version}`;

  utils.run(`ln -s ${linkPath} ${linkName}`, { options: {
    cwd: imagesDir,
  } }).catch(utils.logError);
};

const runTask = () => (
  cleanUp()
    .then(() => (
      getEmojiVersion()
        .then(createSymlimk)
        .catch(utils.logError)
    ))
    .catch(utils.logError)
);

module.exports = runTask;
