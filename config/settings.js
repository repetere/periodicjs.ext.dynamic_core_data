'use strict';

module.exports = {
  settings: {
    defaults: true,
    sync_on_start: true,
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