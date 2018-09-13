'use strict';
const connect = require('./connect');
const model = require('./model');
const adapters = require('./adapters');

module.exports = {
  connect,
  adapters,
  model,
};