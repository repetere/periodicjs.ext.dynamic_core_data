'use strict';
// const connect = require('./connect');
const fs = require('fs-extra');
const path = require('path');
const vm = require('vm');
const flatten = require('flat');
const periodic = require('periodicjs');
// const periodicInit = require('periodicjs/lib/init');

const SEQUELIZE_MIXED_FIELD = Symbol('::SQL_MIXED::');
function getSQLMixedField(key) {
  return `type: Sequelize.TEXT,
    // allowNull: false,
    get() {
      return this.getDataValue('${key}') ? JSON.parse(this.getDataValue('${key}')) : {};
    },
    set(val) {
      this.setDataValue('${key}', JSON.stringify(val));
    },`;
}

const dataTypes = {
  lowkie: {
    ObjectId:'ObjectId',
    String:'String',
    Date:'Date',
    Boolean:'Boolean',
    Number:'Number',
    Integer:'Number',
    'Schema.Types.Mixed':'Schema.Types.Mixed',
    Ref:'ObjectId',
    '[ObjectId]':'ObjectId',
    '[String]':'String',
    '[Date]':'Date',
    '[Boolean]':'Boolean',
    '[Number]':'Number',
    '[Schema.Types.Mixed]':'Schema.Types.Mixed',
    '[Ref]':'ObjectId',
  },
  mongoose: {
    ObjectId:'ObjectId',
    String:'String',
    Date:'Date',
    Boolean:'Boolean',
    Number:'Number',
    Integer:'Number',
    'Schema.Types.Mixed':'Schema.Types.Mixed',
    Ref:'ObjectId',
    '[ObjectId]':'ObjectId',
    '[String]':'String',
    '[Date]':'Date',
    '[Boolean]':'Boolean',
    '[Number]':'Number',
    '[Schema.Types.Mixed]':'Schema.Types.Mixed',
    '[Ref]':'ObjectId',
  },
  sequelize: {
    ObjectId:'Sequelize.INTEGER',
    String:'Sequelize.STRING',
    Date:'Sequelize.DATE',
    Boolean:'Sequelize.BOOLEAN',
    Number:'Sequelize.FLOAT',
    Integer:'Sequelize.INTEGER',
    'Schema.Types.Mixed': SEQUELIZE_MIXED_FIELD,
    Ref:'Sequelize.INTEGER',
    '[ObjectId]':'ObjectId',
    '[String]':'String',
    '[Date]':'Date',
    '[Boolean]':'Boolean',
    '[Number]':'Number',
    '[Schema.Types.Mixed]': SEQUELIZE_MIXED_FIELD,
    '[Ref]':'ObjectId',
  },
};
const logger = periodic.logger;

function generateModel(options) {
  return {
    lowkie: generateLowkieModel(options),
    mongoose: generateMongooseModel(options),
    sequelize: generateSequelizeModel(options),
  };
}

function getCoreDataModelProperties(options) {
  const { model, } = options;
  model.scheme_associations = (typeof model.scheme_associations === 'undefined') ? '[]' : model.scheme_associations.replace(/(\r\n|\w|\n|\r)/gm, '');
  model.scheme_core_data_options = (model.scheme_core_data_options) ? model.scheme_core_data_options : {};
  // console.log({model})
  const sandbox = {
    scheme_core_data_options: {
      sort : {},
      docid : {},
      search : {},
      population : {},
    },
    scheme_options: {},
    scheme_associations: {},
  };
  const script = new vm.Script(`
scheme_core_data_options.sort = ${model.scheme_core_data_options.sort||'{}'};
scheme_core_data_options.docid = ${model.scheme_core_data_options.docid||'[]'};
scheme_core_data_options.search = ${model.scheme_core_data_options.search || '[]'};
scheme_core_data_options.population = ${model.scheme_core_data_options.population||'""'}
scheme_options = ${model.scheme_options || '{}'}
scheme_associations = ${model.scheme_associations||'[]'}
`);
  const context = vm.createContext(sandbox);
  script.runInNewContext(context);
  // console.log({ sandbox });

  return sandbox;
}

function getFieldProps(options) {
  const { type, field, } = options;
  let schemaField = {};
  if (type === 'sequelize') {
    const fieldType = dataTypes[ type ][ field.field_type ];
    if (fieldType === SEQUELIZE_MIXED_FIELD) {
      schemaField.toJSON = () => Object.assign({}, schemaField, {
        type: `::MIXED_FIELD::${field.field_name}::`,
      });
    } else {
      schemaField.type = fieldType;
    }
  } else {
    if (field.field_type.indexOf('[') !== -1) {
      schemaField = [
        {
          type : dataTypes[ type ][ field.field_type ],
        },
      ];
    } else {
      schemaField.type = dataTypes[ type ][ field.field_type ];
    }
    if (field.field_ref) {
      schemaField.ref = field.field_ref; 
    }
    if (field.field_expires) {
      schemaField.expires = field.field_expires; 
    }
  }
  if (field.field_default) {
    schemaField.default = field.field_default; 
  }
  if (field.field_props) {
    try {
      let sandbox = {
        attrs: {},
      };
      vm.runInNewContext(`attrs = ${field.field_props}`, sandbox);
      let fieldAttributes = sandbox.attrs;// JSON.parse(field.field_props);
      schemaField = Object.assign({}, schemaField, fieldAttributes);
    } catch (e) {
      logger.error(e);
    }
  }
  return schemaField;
}

function getSchemaFields(options) {
  const { type, fields, } = options;
  const scheme = {};

  fields.forEach(field => {
    scheme[ field.field_name ] = getFieldProps({ type, field, });
  });
  // console.log('unflatted ',{scheme})

  return flatten.unflatten(flatten(scheme));
}

function getRawValue(value) {
  const replacers = [
    [/"String"/gi, 'String',],
    [/"Number"/gi, 'Number'],
    [/"Date"/gi, 'Date'],
    [/"Date.now"/gi, 'Date.now'],
    [/"Boolean"/gi, 'Boolean'],
    [/"ObjectId"/gi, 'ObjectId'],
    [/"Schema.Types.Mixed"/gi, 'Schema.Types.Mixed'],
    [/"Sequelize.INTEGER"/gi, 'Sequelize.INTEGER'],
    [/"Sequelize.STRING"/gi, 'Sequelize.STRING'],
    [/"Sequelize.DATE"/gi, 'Sequelize.DATE'],
    [/"Sequelize.BOOLEAN"/gi, 'Sequelize.BOOLEAN'],
    [/"Sequelize.FLOAT"/gi, 'Sequelize.FLOAT'],
    [/"Number"/gi, 'Number'],
    [/"Number"/gi, 'Number'],
    [/Date:/gi, 'date:'],
  ];
  let found;
  const mixedFieldRegexp = /"type":\s*"::MIXED_FIELD::([^:]+)::"/g
  do {
    found = mixedFieldRegexp.exec(value);
    if (found) {
      const [, key] = found;
      replacers.push([
        new RegExp(`"type":\\s*"::MIXED_FIELD::${key}::"`, 'g'),
        getSQLMixedField(key),
      ]);
    }
  } while (found);

  return replacers.reduce((result, [regex, replaceWith]) => {
    return result.replace(regex, replaceWith);
  }, value);
}

function generateLowkieModel(options) {
  const { model, } = options;
  const sandbox = getCoreDataModelProperties(options);
  const scheme = getSchemaFields({ type: 'lowkie', fields: model.scheme_fields, });
  // console.log({ scheme });
  
  return `'use strict';
const lowkie = require('lowkie');
const Schema = lowkie.Schema;
const ObjectId = Schema.ObjectId;
const scheme = ${ getRawValue(JSON.stringify(scheme, null, 2)) };

module.exports = {
  scheme,
  options: ${JSON.stringify(sandbox.scheme_options)},
  associations: ${JSON.stringify(sandbox.scheme_associations)},
  coreDataOptions: {
    sort: ${JSON.stringify(sandbox.scheme_core_data_options.sort)},
    docid: ${JSON.stringify(sandbox.scheme_core_data_options.docid)},
    search: ${JSON.stringify(sandbox.scheme_core_data_options.search)},
    population: ${JSON.stringify(sandbox.scheme_core_data_options.population)},
  },
};`;
}

function generateMongooseModel(options) {
  const { model, } = options;
  const sandbox = getCoreDataModelProperties(options);
  const scheme = getSchemaFields({ type: 'mongoose', fields: model.scheme_fields, });
  // console.log('generateMongooseModel',{ scheme });
  
  return `'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const scheme = ${getRawValue(JSON.stringify(scheme, null, 2))};

module.exports = {
  scheme,
  options: ${JSON.stringify(sandbox.scheme_options)},
  associations: ${JSON.stringify(sandbox.scheme_associations)},
  coreDataOptions: {
    sort: ${JSON.stringify(sandbox.scheme_core_data_options.sort)},
    docid: ${JSON.stringify(sandbox.scheme_core_data_options.docid)},
    search: ${JSON.stringify(sandbox.scheme_core_data_options.search)},
    population: ${JSON.stringify(sandbox.scheme_core_data_options.population)},
  },
};`;
}

function generateSequelizeModel(options) {
  const { model, } = options;
  const sandbox = getCoreDataModelProperties(options);
  const scheme = getSchemaFields({ type: 'sequelize', fields: model.scheme_fields, });

  return `'use strict';
const Sequelize = require('sequelize');
const scheme = ${getRawValue(JSON.stringify(scheme, null, 2))};

module.exports = {
  scheme,
  options: ${JSON.stringify(sandbox.scheme_options)},
  associations: ${JSON.stringify(sandbox.scheme_associations)},
  coreDataOptions: {
    sort: ${JSON.stringify(sandbox.scheme_core_data_options.sort)},
    docid: ${JSON.stringify(sandbox.scheme_core_data_options.docid)},
    search: ${JSON.stringify(sandbox.scheme_core_data_options.search)},
    population: ${JSON.stringify(sandbox.scheme_core_data_options.population)},
  },
};`;
}

function getExtensionDBModelDir(options) {
  const { periodic_db_name, db_ext_name, } = options;
  return path.join(this.config.app_root, `node_modules/${db_ext_name}/config/databases/${periodic_db_name}/models`);
}

function ensureModelDir(options) {
  return new Promise((resolve, reject) => {
    try {
      const { database, } = options;
      const getModelDir = getExtensionDBModelDir.bind(periodic);
      const modelDirPath = getModelDir({
        periodic_db_name: database.periodic_db_name,
        db_ext_name: 'periodicjs.ext.dynamic_core_data',
      }); 
      resolve(fs.ensureDir(modelDirPath));
    } catch (e) {
      reject(e);
    }
  });
}

function createModelFile(options) {
  return new Promise((resolve, reject) => {
    try {
      const { database, model, } = options;
      const getModelDir = getExtensionDBModelDir.bind(periodic);
      // const getExtensionDBModelDir = periodicInit.config.getExtensionDBModelDir.bind(periodic);
      const modelDirPath = getModelDir({
        periodic_db_name: database.periodic_db_name,
        db_ext_name: 'periodicjs.ext.dynamic_core_data',
      });
      // console.log('createModelFile', { database, model, modelDirPath });
      fs.ensureDir(modelDirPath)
        .then(() => {
          const modelStrings = generateModel(options);
          resolve(Promise.all([
            fs.outputFile(path.join(modelDirPath, `${model.name}.lowkie.js`), modelStrings.lowkie),
            fs.outputFile(path.join(modelDirPath, `${model.name}.mongoose.js`), modelStrings.mongoose),
            fs.outputFile(path.join(modelDirPath, `${model.name}.sequelize.js`), modelStrings.sequelize),
          ]));
        })  
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  dataTypes,
  getCoreDataModelProperties,
  generateModel,
  getFieldProps,
  getSchemaFields,
  getRawValue,
  generateLowkieModel,
  generateMongooseModel,
  generateSequelizeModel,
  getExtensionDBModelDir,
  ensureModelDir,
  createModelFile,
};