'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const scheme = {
  id: ObjectId,
  type: {
    type: String, //lowkie,sequelize,mongoose
  },
  name: {
    type: String,
    index: {
      unique: true,
      sparse: false
    }
  },
  database_name: {
    type: String,
    index: {
      unique: true,
      sparse: false
    }
  },
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
};

module.exports = {
  scheme,
  options: {},
  coreDataOptions: {
    sort: { createdat: -1, },
    docid: ['_id','name','database_name'],
    search: ['name', 'title', 'options.dbpath', 'options.url', 'options.database','database_name','description' ],
    // population: false,
  },
};