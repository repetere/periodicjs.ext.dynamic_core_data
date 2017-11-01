'use strict';
const periodic = require('periodicjs');
const logger = periodic.logger;
const utilities = require('../utilities');
// const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');
// const reactapp = reactappLocals.reactapp();
// function testPreTransform(req) {
//   return new Promise((resolve, reject) => {
//     periodic.logger.silly('sample pre transfrom', req.params.id);
//     resolve(req);
//   });
// }
// function testPostTransform(req) {
//   return new Promise((resolve, reject) => {
//     periodic.logger.silly('sample post transfrom', req.params.id);
//     resolve(req);
//   });
// }

function resyncDatabase(req) {
  return new Promise((resolve, reject) => {
    resolve(req);
    let t = setTimeout(() => { 
      utilities.connect.connectDynamicDatabases()
      .then(() => {
        logger.silly('resynced database');
      })
        .catch(logger.error);
      clearTimeout(t);
    }, 2000);
  });
}

module.exports = {
  pre: {
    GET: {
      // '/some/route/path/:id':[testPreTransform]
    },
    PUT: {
      [`/contentdata/dynamicdb_coredatadbs/:id`]:[resyncDatabase],
      [`/contentdata/dynamicdb_coredatamodels/:id`]:[resyncDatabase],
      [`/r-admin/contentdata/dynamicdb_coredatadbs/:id`]:[resyncDatabase],
      [`/r-admin/contentdata/dynamicdb_coredatamodels/:id`]:[resyncDatabase],
    },
    POST: {
      [`/contentdata/dynamicdb_coredatadbs`]:[resyncDatabase],
      [`/contentdata/dynamicdb_coredatamodels`]:[resyncDatabase],
      [`/r-admin/contentdata/dynamicdb_coredatadbs`]:[resyncDatabase],
      [`/r-admin/contentdata/dynamicdb_coredatamodels`]:[resyncDatabase],
    }
  },
  post: {
    GET: {
      // '/another/route/test/:id':[testPostTransform]
    },
    // PUT: {
    //   [`/contentdata/dynamicdb_coredatadbs/:id`]:[resyncDatabase],
    //   [`/contentdata/dynamicdb_coredatamodels/:id`]:[resyncDatabase],
    //   [`/r-admin/contentdata/dynamicdb_coredatadbs/:id`]:[resyncDatabase],
    //   [`/r-admin/contentdata/dynamicdb_coredatamodels/:id`]:[resyncDatabase],
    // },
    // POST: {
    //   [`/contentdata/dynamicdb_coredatadbs`]:[resyncDatabase],
    //   [`/contentdata/dynamicdb_coredatamodels`]:[resyncDatabase],
    //   [`/r-admin/contentdata/dynamicdb_coredatadbs`]:[resyncDatabase],
    //   [`/r-admin/contentdata/dynamicdb_coredatamodels`]:[resyncDatabase],
    // }
  }
}