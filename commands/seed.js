'use strict';
const periodic = require('periodicjs');

function utilityFunction(functionName, options) {
  return new Promise((resolve, reject) => {
    try {
      const [
        filepath, includeArray='', excludeArray='',
      ] = options.split(',,,');
      const excluded_datas = excludeArray.split(',');
      const include_datas = includeArray.split(',');
      const functionMap = {
        exportSeed:'exportData',
        importSeed:'importData',
      };
      // console.log({ filepath, excluded_datas, include_datas, functionName, options})
    
      periodic.logger.silly('waiting on dynamic core data configuration');
      periodic.status.on('extension-periodicjs.ext.dynamic_core_data-configured', (status) => {
        periodic.logger.silly('dynamic core data configured');
        periodic.locals.extensions.get('periodicjs.ext.dbseed')[functionName][functionMap[functionName]]({ filepath, excluded_datas, include_datas, })
          .then(seedStatus => {
            periodic.logger.silly('seeds exported');
            resolve(seedStatus);
          })
          .catch(e => {
            periodic.logger.error(e);
            reject(e);
          });
      });
    } catch (e) {
      reject(e);
    }
  });
}

function export_collection(options) {
  //$ periodicjs extension periodicjs.ext.dynamic_core_data export_collection path/to/some/json,,,include1,include2,,,exclude1,exclude2
  // periodicjs extension periodicjs.ext.dynamic_core_data export_collection ~/Downloads/testexportseed.json;dcd_transactions_transaction
  return utilityFunction('exportSeed', options);
}

function import_collection(options) {
  return utilityFunction('importSeed', options);
}

module.exports = {
  export_collection,
  import_collection,
};