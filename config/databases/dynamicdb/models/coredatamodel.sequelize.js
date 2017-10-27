'use strict';
const Sequelize = require('sequelize');

const scheme = {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  database_name: {
    type: Sequelize.STRING,
  },
  scheme_fields: {
    type: Sequelize.STRING,
    // allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('scheme_fields'));
    },
    set(val) {
      this.setDataValue('scheme_fields', JSON.stringify(val));
    },
  },
  scheme_options: {
    type: Sequelize.STRING,
    // allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('scheme_options'));
    },
    set(val) {
      this.setDataValue('scheme_options', JSON.stringify(val));
    },
  },
  scheme_associations: {
    type: Sequelize.STRING,
    // allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('scheme_associations'));
    },
    set(val) {
      this.setDataValue('scheme_associations', JSON.stringify(val));
    },
  },
  scheme_core_data_options: {
    type: Sequelize.STRING,
    // allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('scheme_core_data_options'));
    },
    set(val) {
      this.setDataValue('scheme_core_data_options', JSON.stringify(val));
    },
  },
};

module.exports = {
  scheme,
  options: {},
  coreDataOptions: {
    sort: { createdat: -1, },
    docid: ['_id','name','database_name'],
    search: ['name', 'title', 'description' ],
    // population: false,
  },
};