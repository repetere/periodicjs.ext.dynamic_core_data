'use strict';
const periodic = require('periodicjs');
// let reactapp = periodic.locals.extensions.get('periodicjs.ext.reactapp').reactapp();
const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');
const reactapp = reactappLocals.reactapp();

const modelForm = (options = {}) => {
  return reactappLocals.server_manifest.forms.createForm({
    method: (options.update) ? 'PUT' : 'POST',
    action: (options.update)
      ? `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels/:id?format=json&unflatten=true`
      : `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels?format=json&unflatten=true`,
    onSubmit: 'closeModal',
    onComplete: 'refresh',
    // loadingScreen: true,
    style: {
      paddingTop: '1rem',
    },
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
    validations: [
      {
        field: 'title',
        constraints: {
          presence: {
            message: '^Please provide a title',
          },
        },
      },
    ],
    rows: [
      {
        formElements: [
          {
            type: 'select',
            // placeholder:'Title',
            label: 'Type',
            name: 'type',
            value: '---',
            options: [
              {
                value: '---',
                label:'Select a database type',
              },
              {
                value: 'lowkie',
                label: 'Loki',
              },
              {
                value: 'mongoose',
                label: 'MongoDB',
              },
              {
                value: 'sequelize',
                label: 'SQL',
              },
              {
                value: 'redshift',
                label: 'Redshift',
              },
              {
                value: 'bigquery',
                label: 'Big Query',
              },
            ],
          },
        ],
      },
      {
        formElements: [
          {
            type: 'text',
            // placeholder:'Title',
            label: 'Title',
            name: 'title',
          },
          {
            type: 'text',
            // placeholder:'Title',
            label: 'Name',
            name: 'name',
          },
          {
            type: 'text',
            // placeholder:'Title',
            label: 'Database Name',
            name: 'database_name',
          },
        ],
      },
      // {
      //   formElements: [
      //     {
      //       type: 'text',
      //       // placeholder:'Title',
      //       label: 'Database Name (optional)',
      //       name: 'database_name',
      //     },
      //   ],
      // },
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
      {
        formElements: [
          {
            type: 'datatable',
            name: 'scheme_fields',
            label: 'Schema Fields',
            // datalist: {
            //   multi: true,
            //   // selector: '_id',
            //   entity:'standard_userrole',
            //   resourceUrl:`${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels?format=json`,
            // },
            useInputRows: true,
            addNewRows: true,
            flattenRowData: true,
            rowButtons:true,
            headers: [
              {
                sortid:'field_name',
                label:'Field Name',
              },
              {
                sortid:'field_type',
                label: 'Field Type',
                formtype: 'select',
                value: '---',
                defaultValue: '---',
                formoptions:[
                  {
                    value: '---',
                    defaultValue: '---',
                    label: 'Select Type',
                    disabled: true,
                  },
                  {
                    value: 'ObjectId',
                  },
                  {
                    value: 'String',
                  },
                  {
                    value: 'Date',
                  },
                  {
                    value: 'Boolean',
                  },
                  {
                    value: 'Number',
                  },
                  {
                    value: 'Integer',
                  },
                  {
                    value: 'Schema.Types.Mixed',
                  },
                  {
                    value: 'Ref',
                  },
                  {
                    value: '',
                    label: 'Arrays',
                    disabled: true,
                  },
                  {
                    value: '[ObjectId]',
                  },
                  {
                    value: '[String]',
                  },
                  {
                    value: '[Boolean]',
                  },
                  {
                    value: '[Number]',
                  },
                  {
                    value: '[Schema.Types.Mixed]',
                  },
                  {
                    value: '[Ref]',
                  },
                ],
              },
              {
                sortid:'field_default',
                label:'Field Default',
                formtype:'text',
              },
              {
                sortid:'field_unique',
                label: 'Field Unique',
                formtype: 'select',
                value: 0,
                defaultValue: 0,
                formoptions:[
                  {
                    value: 0,
                    defaultValue: 0,
                    label: 'false',
                  },
                  {
                    value: 1,
                    label: 'true',
                  },
                ],
              },
              {
                sortid:'field_ref',
                label: 'Field Ref',
                formtype:'text',
              },
              {
                sortid:'field_expires',
                label:'Field Expires',
                formtype:'text',
              },
              {
                sortid:'field_props',
                formtype: 'text',
                label:'Field Props',
              },
            ],
            passProps: {
              uploadAddButton: true,
              replaceButton:true,
              // uploadAddButton: false,
              // useDownArrowButton: false,
              // useUpArrowButton: false,
              // tableFormAddButtonProps: true,
              turnOffTableSort: true,
              tableProps: {
                isBordered:true,
              },
            },
          },
        ],
      },
      {
        formElements: [
          {
            type: 'code',
            name: 'scheme_core_data_options.sort',
            label: 'Core Data Sort',
            value: `{ 
  createdat: -1,
}
`,
          },
          {
            type: 'code',
            name: 'scheme_core_data_options.docid',
            label: 'Core Data Doc ID',
            value: `[
  '_id', 'name', 
]
`,
          },
        ],
      },
      {
        formElements: [
          {
            type: 'code',
            name: 'scheme_core_data_options.search',
            label: 'Core Data Search',
            value: `[
  'name', 'title', 'description'
]
`,
          },
          {
            type: 'code',
            name: 'scheme_options',
            label: 'Core Data Options',
            value: `{
}          
`,
          },
        ],
      },
      {
        formElements: [
          {
            type: 'text',
            name: 'scheme_core_data_options.population',
            label: 'Core Data Population',
            placeholder: 'users images',
            // passProps: {
            //   // multiple:true,
            // },
          },
          {
            type: 'text',
            name: 'scheme_associations',
            label: 'Core Data Associations',
            value: `[
]
`,
          },
        ],
      },
      {
        formElements: [
          {
            type: 'submit',
            value: (options.update) ? 'Update Model' : 'Add Model',
            layoutProps: {
              style: {
                textAlign: 'center',
              },
            },
          },
        ],
      },
    ],
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
        formdata: ['modeldata', 'data',],
        // formdata: [ 'databasedata', 'data' ],
      }
      : {},
  });
};

const dcdSettings = periodic.settings.extensions[ 'periodicjs.ext.dynamic_core_data' ];

module.exports = {
  containers: (dcdSettings.use_manifests)
    ? {
      [ `${reactapp.manifest_prefix}ext/dcd/manage-models/:id` ]: {
        layout: {
          component: 'Container',
          props: {
            style: {
              padding: '6rem 0',
            },
          },
          children: [
            reactappLocals.server_manifest.helpers.getPageTitle({
              styles: {
                // ui: {}
              },
              asynctitle: ['data', 'title',],
              title: 'Manage Models',
              action: {
                type: 'modal',
                title: 'Add Model',
                pathname: `${reactapp.manifest_prefix}ext/dcd/add-model`,
                buttonProps: {
                  props: {
                    color: 'isSuccess',
                  },
                },
              },
            }),
            {
              component: 'div',
              children: [
                {
                  component: 'span',
                  children: 'Database: ',
                },
                {
                  component: 'span',
                  asyncprops: {
                    children: ['coredb', 'data', 'database_name',],
                  },
                },
              ],
            },
            {
              component: 'ResponsiveTable',
              props: {
                filterSearch: true,
                tableSearch: true,
                flattenRowData: true,
                flattenRowDataOptions: { maxDepth: 3, },
                headers: [
                  {
                    buttons: [
                      {
                        passProps: {
                          onClick: 'func:this.props.createModal',
                          onclickThisProp: 'onclickPropObject',
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
                          buttonProps: {
                            color: 'isInfo',
                            buttonStyle: 'isOutlined',
                            icon: 'fa fa-pencil',
                          },
                        },
                      },
                    ],
                    sortid: '_id',
                    sortable: true,
                    label: 'ID',
                  },
                  {
                    sortable: true,
                    sortid: 'name',
                    label: 'Name',
                  },
                  {
                    sortable: true,
                    sortid: 'type',
                    label: 'Type',
                  },
                  // {
                  //   sortable:true,
                  //   sortid: 'database_name',
                  //   label: 'Model Name',
                  // },
                  {
                    sortable: true,
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
                ],
              },
              asyncprops: {
                rows: ['coredb', 'data', 'core_data_models',],
              },
            },
          ],
        },
        resources: {
          coredb: `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatadbs/:id?format=json`,
        },
        pageData: {
          title: 'Manage Models',
          navLabel: 'Manage Models',
        },
      },
      [ `${reactapp.manifest_prefix}ext/dcd/add-model` ]: {
        layout: {
          component: 'Content',
          children: [modelForm(),
            {
              component: 'div',
              props: {
                dangerouslySetInnerHTML: {
                  __html: `<style>
                .__re-bulma_modal-card{
                  width:auto;
                }
                </style>`,
                },
              },
            },
          ],
        },
        resources: {
          // databasedata: `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels/:id?format=json`,
        },
        pageData: {
          title: 'Add a Model',
          navLabel: 'Add a Model',
        },
      },
      [ `${reactapp.manifest_prefix}ext/dcd/edit-model/:id` ]: {
        layout: {
          component: 'Content',
          children: [modelForm({ update: true, }),
            {
              component: 'div',
              props: {
                dangerouslySetInnerHTML: {
                  __html: `<style>
                .__re-bulma_modal-card{
                  width:auto;
                }
                </style>`,
                },
              },
            },
          ],
        },
        resources: {
          modeldata: `${reactapp.manifest_prefix}contentdata/dynamicdb_coredatamodels/:id?format=json`,
        },
        pageData: {
          title: 'Add a Model',
          navLabel: 'Add a Model',
        },
      },
      // [`${reactapp.manifest_prefix}ext/dcd/edit-model/lowkie/:id`]: getEditForm({form:lowkieForm({ update: true, })}),
      // [`${reactapp.manifest_prefix}ext/dcd/edit-model/mongo/:id`]: getEditForm({form:mongoForm({ update: true, })}),
      // [`${reactapp.manifest_prefix}ext/dcd/edit-model/sql/:id`]: getEditForm({form:sqlForm({ update: true, })}),
    }
    : {},
};
// console.log('modelForm({ update: true, })', util.inspect(Object.assign({}, modelForm({ update: true, }),{ bindprops: true }), { depth: 7 }));