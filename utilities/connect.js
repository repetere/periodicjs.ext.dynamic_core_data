'use strict';
const periodic = require('periodicjs');
const periodicInit = require('periodicjs/lib/init');
const Promisie = require('promisie');
const vm = require('vm');
// const pluralize = require('pluralize');
const logger = periodic.logger;
const model = require('./model');
let dynamicCoredataDatabases={};
// let dynamicCoredataModels = {};
let loadedRouters = new Set();

function connectDynamicDatabases() {
  return new Promise((resolve, reject) => {
    try {
      dynamicCoredataDatabases = periodic.datas.get('dynamicdb_coredatadb');
      // dynamicCoredataModels = periodic.datas.get('dynamicdb_coredatamodel');
      getAllDBs()
        .then(dbs => {
          if (!dbs.length) {
            logger.silly('No custom dbs to load');
            resolve(dbs);
          } else {
            const formattedDBs = dbs.map(db => formatDBforLoad({ database: db, }));
            return Promisie.each(formattedDBs, 5, initializeDB);
          }
        })
        .then(dbs => {
          logger.verbose(`Connected databases: ${dbs.map(db => `${db.database_name}(${db.type})`).join(', ')}`);
          if (periodic.extensions.has('periodicjs.ext.reactapp')) {
            const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');
            const reactapp = reactappLocals.reactapp();
            const dataRouters = reactappLocals.data.getDataCoreController();
            
            let dbroutes = dbs.reduce((result, db) => { 
              if (db.core_data_models && db.core_data_models.length) {
                let coredatamodels = db.core_data_models.map(model => `dcd_${db.database_name}_${model.name}`);
                let missingModels = coredatamodels.filter(coredatamodel => !loadedRouters.has(coredatamodel));
                // console.log({ coredatamodels, missingModels });
                result.push(...missingModels);
              }
              return result;
            }, []);
            // console.log({ dbroutes });
            if (dbroutes.length) {
              logger.silly('adding routes for', { dbroutes, });
              dbroutes.forEach(dbr => {
                const dbrrouter = dataRouters.get(dbr);
                periodic.app.use(`${reactapp.manifest_prefix}contentdata`, dbrrouter.router);
                loadedRouters.add(dbr);
              });
              // loadedRouters.add(...dbroutes);
              // Set new RA views
              reactappLocals.controllerhelper.CORE_DATA_CONFIGURATIONS.manifest =
                reactappLocals.manifest.coreData.generateCoreDataManifests();
              //update navigation
              let core_data_list = [];
              for (let key of periodic.datas.keys()) {
                if (key !== 'configuration' && key !== 'extension') {
                  core_data_list.push(key);
                }
              }
              periodic.app.locals.core_data_list = core_data_list.reduce(periodic.utilities.routing.splitModelNameReducer, {});
              Promisie.all(reactappLocals.controllerhelper.pullConfigurationSettings(), reactappLocals.controllerhelper.pullComponentSettings())
              .then(() => {
                logger.silly('RELOADED MANIFEST SETTINGS ');
              })
                .catch(logger.silly.bind(logger, 'settings error'));
              
              logger.debug('adding new routers', { loadedRouters, });
            } else {
              logger.debug('already added all routes', { loadedRouters, });
            }
          }
          periodic.status.emit('extension-periodicjs.ext.dynamic_core_data-configured', true);          
          resolve(dbs);
        })
        .catch(reject);  
    } catch (e) {
      reject(e);
    }
  });
}

function getAllDBs() {
  return new Promise((resolve, reject) => {
    try {
      return resolve(dynamicCoredataDatabases.query({}));
    } catch (e) {
      return reject(e);
    }
  });
}

function formatDBforLoad(options) {
  const { database, } = options;
  return Object.assign({}, database, {
    db: database.type,
    periodic_db_name: `dcd_${database.database_name}`,
    db_config_type: 'extension',
    extension: 'periodicjs.ext.dynamic_core_data',
    controller: {
      default: {
        responder: {
          adapter: 'json',
        },
        protocol: {
          api: 'rest',
          adapter: 'http',
        },
      },
    },
  });
}

function initializeDB(db) {
  return new Promise((resolve, reject) => {
    try {
      const sandbox = {
        dboptions: {},
        mongoose_options: {},
        connection_options: {},
      };
      const script = new vm.Script(`
      dboptions = ${db.options.dboptions||'{}'};
      mongoose_options = ${db.options.mongoose_options||'{}'};
      connection_options = ${db.options.connection_options || '{}'};
      `);
      const context = vm.createContext(sandbox);
      const connectSettingsDB = periodicInit.config.connectDB.bind(periodic);
      script.runInContext(sandbox);
      db.options = Object.assign({}, db.options, sandbox);
      if (db && db.core_data_models&& db.core_data_models.length) {
        Promise.all(db.core_data_models.map(modelObj => model.createModelFile({ database: db, model: modelObj, })))
          .then(setupmodels => {
            resolve(connectSettingsDB(db));
          }).catch(reject);
      } else {
        model.ensureModelDir({ database: db, })
          .then(() => {
            resolve(connectSettingsDB(db));
          });
        // resolve(
        // );
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  connectDynamicDatabases,
  getAllDBs,
};