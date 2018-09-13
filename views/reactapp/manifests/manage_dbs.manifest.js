'use strict';
const periodic = require('periodicjs');
// let reactapp = periodic.locals.extensions.get('periodicjs.ext.reactapp').reactapp();
const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');
const reactapp = reactappLocals.reactapp();

const newDBForm = (options = {}) => reactappLocals.server_manifest.forms.createForm({
  method: (options.update) ? 'PUT' : 'POST',
  action: (options.update)
    ? `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs/:id?format=json&unflatten=true&handleupload=true`
    : `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs?format=json&unflatten=true`,
  onSubmit: 'closeModal',
  onComplete: 'refresh',
  // loadingScreen: true,
  style: {
    paddingTop: '1rem',
  },
  hiddenFields: options.hiddenFields,
  validations: [
    {
      field: 'title',
      constraints: {
        presence: {
          message: '^Please provide a title',
        },
      },
    },
    {
      field: 'database_name',
      constraints: {
        presence: {
          message: '^Please provide a database name',
        },
      },
    },
  ].concat(options.validations),
  rows: [
    {
      formElements: [
        {
          type: 'text',
          // placeholder:'Title',
          label: 'Title',
          name: 'title',
        },
      ],
    },
    {
      formElements: [
        {
          type: 'text',
          // placeholder:'Title',
          label: 'Database Name',
          name: 'database_name',
        },
      ],
    },
    {
      formElements: [
        {
          type: 'text',
          // placeholder:'Title',
          label: 'Description',
          name: 'description',
        },
      ],
    },
  ]
    .concat(options.customDBFields)
    .concat([
      {
        formElements: [
          {
            type: 'datalist',
            name: 'core_data_models',
            label: 'Database Models',
            datalist: {
              multi: true,
              selector: '_id',
              entity:'dynamicdb_coredatamodel',
              resourceUrl:`${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels?format=json`,
            },
            // passProps: {
            //   // multiple:true,
            // },
          },
        ],
      },
      {
        formElements: [
          {
            type: 'submit',
            value: (options.update) ? 'Update Database' : 'Add Database',
            layoutProps: {
              style: {
                textAlign: 'center',
              },
            },
          },
        ],
      },
    ]),
  actionParams: (options.update)
    ? [
      {
        key: ':id',
        val: '_id',
      },
    ]
    : undefined,
  // hiddenFields
  asyncprops: (options.update)
    ? {
      formdata: ['databasedata', 'data', ],
      // formdata: [ 'databasedata', 'data' ],
    }
    : {},
});
const lowkieForm = (options = {}) => newDBForm(Object.assign({
  hiddenFields: [
    {
      form_static_val: 'lowkie',
      form_name: 'type',
    },
    {
      form_val: '_id',
      form_name: '_id',
    },
    {
      form_val: 'name',
      form_name: 'name',
    },
    {
      form_val: '$loki',
      form_name: '$loki',
    },
    {
      form_val: 'meta',
      form_name: 'meta',
    },
  ],
  customDBFields: [
    {
      formElements: [
        {
          type: 'text',
          name: 'options.dbpath',
          label: 'Database Path',
          placeholder: 'content/data/customdb/custom_database.json',
        },
      ],
    },
  ],
  validations: [
    // {
    //   field: 'options.dbpath',
    //   constraints: {
    //     presence: {
    //       message: '^Loki Databases require a path to a json file',
    //     },
    //   },
    // },  
  ],
}, options));
const mongoForm = (options = {}) => newDBForm(Object.assign({
  hiddenFields: [
    {
      form_static_val: 'mongoose',
      form_name: 'type',
    },
    {
      form_val: '_id',
      form_name: '_id',
    },
    {
      form_val: 'name',
      form_name: 'name',
    },
    {
      form_val: '$loki',
      form_name: '$loki',
    },
    {
      form_val: 'meta',
      form_name: 'meta',
    },
  ],
  customDBFields: [
    {
      formElements: [
        {
          type: 'text',
          name: 'options.url',
          label: 'MongoDB URL',
          placeholder: 'mongodb://localhost:27017/config_db',
          // passProps: {
          //   // multiple:true,
          // },
        },
      ],
    },
    {
      formElements: [
        {
          type: 'code',
          name: 'options.mongoose_options',
          label: 'Mongoose Options',
          value: `//{
//  "replset": { "rs_name": "cd6d32c5781f462b9de19e84fbd40fd0" },
//  "server":{
//    "keepAlive": 1,
//    "connectTimeoutMS": 30000,
//    "socketTimeoutMS": 30000
//  }
//}`,
          // passProps: {
          //   // multiple:true,
          // },
        },
      ],
    },
  ],
  validations: [
    {
      field: 'options.url',
      constraints: {
        length: {
          minimum:1,
          message: '^Mongo Databases require a valid mongo url',
        },
      },
    },
  ],
}, options));
const sqlForm = (options = {}) => newDBForm(Object.assign({
  hiddenFields: [
    
    {
      form_val: '_id',
      form_name: '_id',
    },
    {
      form_val: 'name',
      form_name: 'name',
    },
    {
      form_val: '$loki',
      form_name: '$loki',
    },
    {
      form_val: 'meta',
      form_name: 'meta',
    },
  ],
  customDBFields: [
    {
      formElements: [
        {
          type: 'text',
          name: 'options.database',
          label: 'Database name',
          placeholder: 'customdb',
          // passProps: {
          //   // multiple:true,
          // },
        },
        {
          type: 'select',
          name: 'type',
          label: 'DB Type',
          options: [
            {
              label: 'SQL / Sequelize',
              value:'sequelize',
            },
            {
              label: 'Redshift',
              value:'redshift',
            },
            {
              label: 'Big Query',
              value:'bigquery',
            },
          ],
        },
      ],
    },
    {
      formElements: [
        {
          type: 'text',
          name: 'options.username',
          label: 'Database username',
          placeholder: 'usr',
          // passProps: {
          //   // multiple:true,
          // },
        },
        {
          type: 'text',
          name: 'options.password',
          label: 'Database password',
          placeholder: 'pwd',
          passProps: {
            type: 'password',
          },
        },
      ],
    },
    {
      formElements: [
        {
          type: 'code',
          name: 'options.connection_options',
          label: 'Database connection options (sequelize)',
          value: `//{
//  'dialect': 'postgres',
//  'port': 5432,
//  'host': '127.0.0.1',
//}`,
          // passProps: {
          //   // multiple:true,
          // },
        },
      ],
    },
  ],
  validations: [
    {
      field: 'options.database',
      constraints: {
        length: {
          minimum:1,
          message: '^SQL Databases require a database name',
        },
      },
    },
  ],
}, options));

const databaseForm = (options = {}) => {
  return reactappLocals.server_manifest.tabs.getTabs({
    type: 'pageToggle',
    tabs: [
      {
        name: 'MongoDB',
        layout: mongoForm(options),
      },
      {
        name: 'SQL',
        layout: sqlForm(options),
      },
      {
        name: 'Loki DB',
        layout: lowkieForm(options),
      },
    ],
  });
};

const getEditForm = (options = {}) => ({
  layout: {
    component: 'Content',
    children: [
      options.form,
    ],
  },
  resources: {
    databasedata: `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs/:id?format=json`,
  },
  pageData: {
    title: 'Edit Database',
    navLabel:'Edit Database',
  },
}); 

module.exports = {
  containers: {
    [`${reactapp.manifest_prefix}ext/dcd/manage-databases`]: {
      layout: {
        component: 'Container',
        props: {
          style: {
            padding:'6rem 0',
          },
        },
        children: [
          reactappLocals.server_manifest.helpers.getPageTitle({
            styles: {
              // ui: {}
            },
            title: 'Manage Databases',
            action: [
              {
                type: 'modal',
                title: 'Add Database',
                pathname: `${reactapp.manifest_prefix}ext/dcd/add-database`,
                buttonProps: {
                  props: {
                    color:'isSuccess',
                  },
                },
              },
              {
                type: 'modal',
                title: 'Add Model',
                pathname: `${reactapp.manifest_prefix}ext/dcd/add-model`,
                buttonProps: {
                  props: {
                    color:'isSuccess',
                  },
                },
              },
            ],
          }),
          reactappLocals.server_manifest.table.getTable({
            schemaName: 'dynamicdb_coredatadbs',
            baseUrl:`${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs?format=json`,
            asyncdataprops: 'databases',
            headers: [
              {
                buttons: [
                  {
                    passProps: {
                      onClick: 'func:this.props.createModal',
                      onclickThisProp:'onclickPropObject',
                      onclickProps: {
                        title: 'Edit Database',
                        pathname: `${reactapp.manifest_prefix}ext/dcd/edit-database/:type/:id`,
                        params: [
                          {
                            key: ':id',
                            val: '_id',
                          },
                          {
                            key: ':type',
                            val: 'type',
                          },
                        ],
                      },
                      buttonProps:{
                        color: 'isInfo',
                        buttonStyle: 'isOutlined',
                        icon:'fa fa-pencil',
                      },
                    },
                  },
                ],
                sortid: '_id',
                sortable:true,
                label: 'ID',
              },
              {
                sortable:true,
                sortid: 'database_name',
                label: 'Database Name',
              },
              {
                sortable:true,
                sortid: 'type',
                label: 'Type',
              },
              {
                sortable:true,
                sortid: 'description',
                label: 'Description',
                headerStyle: {
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                columnStyle: {
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              },
              {
                sortid:'core_data_models',
                label: 'Edit Models',
                customCellLayout: {
                  component: 'DynamicLayout',
                  thisprops: {
                    items:['cell', ],
                  },
                  bindprops: true,
                  props: {
                    layout: {
                      bindprops:true,
                      component: 'ResponsiveButton',
                      thisprops: {
                        _children:['name', ],
                      },
                      props: {
                        style: {
                          marginRight: '0.5rem',
                        },
                        onClick: 'func:this.props.createModal',
                        // onclickThisProp:'onclickPropObject',
                        onclickProps: {
                          title: 'Edit Model',
                          pathname: `${reactapp.manifest_prefix}ext/dcd/edit-model/:id`,
                          params: [
                            {
                              key: ':id',
                              val: '_id',
                            },
                            {
                              key: ':type',
                              val: 'type',
                            },
                          ],
                        },
                        buttonProps:{
                          color: 'isInfo',
                          buttonStyle: 'isOutlined',
                          icon:'fa fa-database',
                        },
                      },
                    },
                  },
                },
                // buttons: [
                //   {
                //     passProps: {
                //       onClick: 'func:this.props.reduxRouter.push',
                //       onclickBaseUrl: `${reactapp.manifest_prefix}ext/dcd/manage-models/:id`,
                //       onclickLinkParams: [
                //         {
                //           key: ':id',
                //           val: '_id',
                //         },
                //         // {
                //         //   key: ':type',
                //         //   val: 'type',
                //         // },
                //       ],
                //       // onclickThisProp:'onclickPropObject',
                //       // onclickProps: {
                //       //   title: 'Edit Database',
                //       //   pathname: `${reactapp.manifest_prefix}ext/dcd/edit-database/:type/:id`,
                //       //   params: [
                //       //     {
                //       //       key: ':id',
                //       //       val: '_id',
                //       //     },
                //       //     {
                //       //       key: ':type',
                //       //       val: 'type',
                //       //     },
                //       //   ],
                //       // },
                //       buttonProps:{
                //         color: 'isInfo',
                //         buttonStyle: 'isOutlined',
                //         icon:'fa fa-database',
                //         children:'Edit Models',
                //       },
                //       children:'Edit Models',
                //     },
                //   }
                // ],
              },
            ],
          }),
        ],
      },
      resources: {
        databases:`${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs?format=json`,
      },
      pageData: {
        title:'Manage Databases',
        navLabel:'Manage Databases',
      },
    },
    [`${reactapp.manifest_prefix}ext/dcd/add-database`]: {
      layout: {
        component: 'Content',
        children:[databaseForm(), ],
      },
      resources: {},
      pageData: {
        title:'Add a Database',
        navLabel:'Add a Database',
      },
    },
    [`${reactapp.manifest_prefix}ext/dcd/edit-database/lowkie/:id`]: getEditForm({ form:lowkieForm({ update: true, }),  }),
    [`${reactapp.manifest_prefix}ext/dcd/edit-database/mongoose/:id`]: getEditForm({ form:mongoForm({ update: true, }), }),
    [`${reactapp.manifest_prefix}ext/dcd/edit-database/sequelize/:id`]: getEditForm({ form:sqlForm({ update: true, }), }),
    [`${reactapp.manifest_prefix}ext/dcd/edit-database/redshift/:id`]: getEditForm({ form:sqlForm({ update: true, }), }),
    [`${reactapp.manifest_prefix}ext/dcd/edit-database/bigquery/:id`]: getEditForm({ form:sqlForm({ update: true, }), }),
  },
};
// console.log('databaseForm({ update: true, })', util.inspect(Object.assign({}, databaseForm({ update: true, }),{ bindprops: true }), { depth: 7 }));