const { asClass, asValue, Lifetime } = require('awilix');
const axios = require('axios');
const express = require('express');

const router = require('./router');
const config = require('./config');

const IoC = require('./IoC');
const ioc = new IoC;

ioc.register({
  excludes: asValue([]),
  config: asValue(config),
  httpClient: asValue(axios),
  httpServer: asValue(express()),
  router: asClass(router),
});

const container = ioc.loadModules([
  'App.js',
  'utils/*.js',
  // 'db/Db.js',
  'model/*.js',
  'controller/*.js',
  'query/*.js',
  'command/*.js',
  // 'query/__mocks__/*.js',
  // 'command/__mocks__/*.js',
], {
  resolverOptions: {
    lifetime: Lifetime.SINGLETON
  }
});

module.exports = container;
