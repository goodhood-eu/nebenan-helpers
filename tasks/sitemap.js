require('../require_hooks');

const { createRoutes } = require('react-router');
const createStore = require('../client/store');
const createRouter = require('../client/router');
const { logResult } = require('./utils');

const getPlainRoutes = (tree) => {
  const result = [];

  const recursive = (route, parentPath) => {
    const { childRoutes } = route;
    let { path } = route;
    if (parentPath) path = `${parentPath}/${path}`;
    if (path) result.push(path);
    if (childRoutes) childRoutes.forEach((item) => recursive(item, path));
  };

  recursive({ childRoutes: tree });
  return result;
};

const generateRoutes = () => {
  const store = createStore();
  const { routes } = createRouter(store);

  const tree = createRoutes(routes);
  const result = getPlainRoutes(tree);
  logResult({ result });
};

module.exports = generateRoutes;
