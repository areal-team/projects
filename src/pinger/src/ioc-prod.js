const { asClass, asValue, Lifetime } = require('awilix');
const axios = require('axios');

const config = require('./config');

const IoC = require('./IoC');
const ioc = new IoC;

ioc.register({
  excludes: asValue([]),
  config: asValue(config),
  httpClient: asValue(axios),
});

const container = ioc.loadModules([
  'App.js',
  'utils/*.js',
  'model/*.js',
  'query/*.js',
  'command/*.js',
  // 'model/__mocks__/*.js',
], {
  resolverOptions: {
    lifetime: Lifetime.SINGLETON
  }
});

module.exports = container;
