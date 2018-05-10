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
      sparse: false,
    },
  },
  database_name: {
    type: String,
    // index: {
    //   unique: true,
    //   sparse: false,
    // },
  },
  description: String,
  title: String,
  scheme_fields: [
    {
      field_name: String,
      field_type: String,
      field_default: String,
      field_unique: Boolean,
      field_index: Boolean,
      field_expires: String,
      field_ref: String,
      field_props: String,
    },
  ],
  scheme_options: Schema.Types.Mixed,
  scheme_associations: Schema.Types.Mixed,
  scheme_core_data_options: {
    sort: Schema.Types.Mixed,
    docid: Schema.Types.Mixed,
    search: [String,],
    population: String,
  },
};

module.exports = {
  scheme,
  options: {},
  coreDataOptions: {
    sort: { createdat: -1, },
    docid: ['_id', 'name', 'database_name',],
    search: ['name', 'title', 'description',],
    // population: false,
  },
};