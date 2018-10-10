
const periodic = require('periodicjs');
const periodicInit = require('periodicjs/lib/init');
// const schemeDefaults = require('periodicjs/lib/defaults/schema');
const Promisie = require('promisie');
const fs = require('fs-extra');
const path = require('path');
const BigQuery = require('@google-cloud/bigquery');
const Redshift = require('@repetere/node-redshift');
const logger = periodic.logger;
const getDBModelDir = periodicInit.config.getDBModelDir;
const assignControllers = periodicInit.config.assignControllers;
const fullModelFilePath = '/___FULLPATH___';
const schemaDefaults = {
  bigquery: {
    _id:'integer',
    entitytype:'string',
    createdat:'timestamp',
    updatedat:'timestamp',
  },
  redshift: {
    _id:{
      type: Redshift.DataTypes.BIGINT,
      notNull: true,
      primaryKey: true,
      "index": true,
      "unique": true
    },
    entitytype:{
      type:Redshift.DataTypes.VARCHAR,
    },
    createdat:{
      type:Redshift.DataTypes.TIMESTAMP, default: 'GETDATE()',
    },
    updatedat:{
      type:Redshift.DataTypes.TIMESTAMP, default: 'GETDATE()',
    },
  },
};
async function assignSQLishModels(options) {
  const { modelDirPath, periodic_db_name, db, dboptions, model_type, 
    connection_options, } = options;
  // console.log('assignSQLishModels',{ modelDirPath, periodic_db_name, db, dboptions, model_type, connection_options, })
  let { modelFiles, } = options;
  let firstCoreDataAdapter;
  if (periodic_db_name === 'standard' && this.resources.standard_models.length) {
    modelFiles = modelFiles.concat(this.resources.standard_models);
  }
  const modelpaths = modelFiles.filter(model => model.indexOf(model_type) !== -1);
  modelpaths.forEach((modelFilePath, i) => {
    const modelName = path.basename(modelFilePath.replace(fullModelFilePath, '')).split('.')[ 0 ];
    const modelModule = (modelFilePath.indexOf(fullModelFilePath) !== -1) ?
      require(modelFilePath.replace(fullModelFilePath, '')) :
      require(path.join(modelDirPath, modelFilePath));
    const CoreDataModelSchema = Object.assign({}, modelModule.scheme);
    CoreDataModelSchema.tableProperties = Object.assign({}, CoreDataModelSchema.tableProperties, schemaDefaults[ model_type ]);
    // CoreDataModelSchema.tableProperties.entitytype.default = CoreDataModelSchema.tableName;
    // console.log('connection_options',connection_options)
    if (connection_options.table_prefix) { 
      CoreDataModelSchema.tableName = `${connection_options.table_prefix}${CoreDataModelSchema.tableName}`;
    }
    const CoreConfigDataAdapter = this.core.data.create(
      Object.assign({}, modelModule.coreDataOptions, {
        adapter: model_type,
        model: CoreDataModelSchema,
        db_connection:db,
      }));
    if (dboptions.controller) {
      Object.keys(dboptions.controller).forEach(controller_name => assignControllers.call(this, { dboptions, controller_name, modelName, CoreConfigDataAdapter, periodic_db_name, }));
    }
    this.datas.set(`${periodic_db_name}_${modelName}`, CoreConfigDataAdapter);
    this.models.set(`${periodic_db_name}_${modelName}`, modelModule);
    if (i === 0) {
      firstCoreDataAdapter = CoreConfigDataAdapter;
    }
  });
  if (firstCoreDataAdapter) {
    try {
      const syncStatus = await firstCoreDataAdapter.sync();
      console.log({ syncStatus, });
    } catch (e) {
      logger.silly('SYNC ERROR', e.toString());
    }
  }
  this.dbs.set(periodic_db_name, db);
}

async function connectRedshiftDB(options) {
  const { periodic_db_name, db_config_type, } = options;
  const dboptions = options.options;
  dboptions.connection_options = Object.assign({}, { logging: this.config.debug, }, dboptions.connection_options);
  let { database, username, password, connection_options, } = dboptions;
  const RedshiftDB = new Redshift(Object.assign({}, {
    user: username,
    password: password,
    database: database,
  }, connection_options), {
    longStackTraces: false,
  });
  // console.log({ RedshiftDB });
  const modelDirPath = getDBModelDir.call(this, {
    db_ext_name: options.extension,
    db_container_name: options.container,
    db_container_type: options.container_type,
    db_config_type,
    periodic_db_name,
  });
  const modelFiles = await fs.readdir(modelDirPath);
  return await assignSQLishModels.call(this, {
    modelFiles,
    modelDirPath,
    periodic_db_name,
    model_type: 'redshift',
    db: RedshiftDB,
    dboptions: options,
    connection_options,
  });
}

async function connectBigQueryDB(options) {
  // console.log('options',options)
  const { periodic_db_name, db_config_type, } = options;
  const dboptions = options.options;
  dboptions.connection_options = Object.assign({}, { logging: this.config.debug, }, dboptions.connection_options);
  let { database, username, password, connection_options, } = dboptions;
  // console.log('connectBigQueryDB connection_options', connection_options)
  const BigQueryDB = new BigQuery({ credentials:dboptions.connection_options, });
  const modelDirPath = getDBModelDir.call(this, {
    db_ext_name: options.extension,
    db_container_name: options.container,
    db_container_type: options.container_type,
    db_config_type,
    periodic_db_name,
  });
  const modelFiles = await fs.readdir(modelDirPath);
  return assignSQLishModels.call(this, {
    modelFiles,
    modelDirPath,
    periodic_db_name,
    model_type:'bigquery',
    db: BigQueryDB,
    dboptions: options,
    connection_options,
  });
}

module.exports = {
  connectBigQueryDB,
  connectRedshiftDB,
};