'use strict';
const Sequelize = require('sequelize');

const scheme = {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: Sequelize.STRING,//lowkie,sequelize,mongoose
  },
  name: {
    type: Sequelize.STRING,
  },
  database_name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
  },
  options: {
    type: Sequelize.STRING,
    // allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('options'));
    },
    set(val) {
      this.setDataValue('options', JSON.stringify(val));
    },
  },
};

const options = {
  underscored: true,
  timestamps: true,
  indexes: [{
    fields: ['createdat'],
  }],
};

const associations = [
  {
    source: 'coredatadb',
    association: 'hasMany',
    target: 'coredatamodel',
    options: {
      as: 'core_data_models',
    }
  }
];  

module.exports = {
  scheme,
  options,
  associations,
  coreDataOptions: {
    sort: { createdat: -1, },
    docid: ['_id','name','database_name'],
    search: ['name', 'title', 'options.dbpath', 'options.url', 'options.database','database_name','description' ],
    // population: false,
  },
};