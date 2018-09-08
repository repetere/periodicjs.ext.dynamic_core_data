'use strict';
const periodic = require('periodicjs');
const utilities = require('./utilities');
const logger = periodic.logger;
module.exports = () => {
  periodic.status.on('configuration-complete', (status) => {
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log('calling dynamic database configuration');
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~');
    utilities.connect.connectDynamicDatabases()
      .then(() => {
        logger.silly('loaded dynamic databases');
      })
      .catch(logger.error);
  });
  
  return Promise.resolve(true);
}