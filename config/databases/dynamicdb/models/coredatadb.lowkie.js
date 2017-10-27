'use strict';
const lowkie = require('lowkie');
const Schema = lowkie.Schema;
const ObjectId = Schema.ObjectId;
const scheme = {
  id: ObjectId,
  type: {
    type: String, //lowkie,sequelize,mongoose
  },
  name: String,
  database_name: String,
  description: String,
  title: String,
  options: {
    dbpath: String,//for lowkie
    url: String,//for mongoose
    mongoose_options: Schema.Types.Mixed,//for mongoose
    database: String,//for sequelize
    username: String,//for sequelize
    password: String,//for sequelize
    connection_options: Schema.Types.Mixed,//for sequelize
  },
  core_data_models: [
    {
      type: ObjectId,
      ref: 'Coredatamodel',
    },
  ],
};

module.exports = {
  scheme,
  options: {
    unique: ['name','database_name']    
  },
  coreDataOptions: {
    sort: { createdat: -1, },
    docid: ['_id','name','database_name'],
    search: ['name', 'title', 'options.dbpath', 'options.url', 'options.database','database_name','description' ],
    population: 'core_data_models',
  },
};