require('babel-register')({ extensions: ['.es'] });
const CoffeeScript = require('coffeescript');

const { compile } = CoffeeScript;
const overrides = { transpile: JSON.parse(require('fs').readFileSync(`${__dirname}/.babelrc`)) };
CoffeeScript.compile = (file, options) => compile(file, Object.assign(options, overrides));
CoffeeScript.register();
