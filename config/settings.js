'use strict';

module.exports = {
  settings: {
    defaults:true,
  },
  databases: {
    dynamicdb: {
      router: {},
      controller: {
        default: {
          responder: {
            adapter: 'json'
          },
          protocol: {
            api: 'rest',
            adapter: 'http'
          }
        }
      },
      db: 'lowkie',
      options: {
        dbpath: 'content/data/dynamicdb/dynamic_db.json',
        dboptions: {
          verbose: true,
        },
      },
    }
  },
};