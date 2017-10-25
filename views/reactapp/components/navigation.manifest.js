'use strict';
// const path = require('path');

module.exports = (periodic) => {
  const reactappLocals = periodic.locals.extensions.get('periodicjs.ext.reactapp');
  const reactapp = reactappLocals.reactapp();
  
  return {
    wrapper: {
      style: {},
    },
    container: {
      style: {},
    },
    layout: {
      component: 'Menu',
      props: {
        style: {},
      },
      children: [
        reactappLocals.server_manifest.core_navigation.getSidebarNav({
          title: 'Dynamic Databases',
          links: [
            {
              href: `${reactapp.manifest_prefix}ext/dcd/manage-databases`,
              label: 'Manage Databases',
              id: 'dcd-manage-databases',
            },
            {
              href: `${reactapp.manifest_prefix}ext/dcd/manage-models`,
              label: 'Manage Models',
              id: 'dcd-manage-models',
            },
          ]
        }),
      ],
    },
  };
};