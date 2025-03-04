'use strict';

const config = require('./server/src/config');
const contentTypes = require('./server/src/content-types');
const controllers = require('./server/src/controllers');
const register = require('./server/src/register');
const routes = require('./server/src/routes');

module.exports = () => {
  return {
    register,
    config,
    controllers,
    contentTypes,
    routes,
  };
};
