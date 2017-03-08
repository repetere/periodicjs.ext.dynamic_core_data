// console.log('using BABEL REGISTER', '---------------', '---------------', '---------------', '---------------', '---------------');
// require('babel-register')({
//   'presets': ['react', 'es2015', ],
//   'plugins': ['transform-runtime', 'transform-es2015-modules-commonjs', 'react-css-modules', ],
//   ignore: (filename) => {
//     // console.log(filename, 'filename.indexOf(periodicjs.ext.serverside_ra)', filename.indexOf('periodicjs.ext.serverside_ra') );
//     // console.log(filename, 'filename.indexOf(periodicjs.ext.serverside_ra/node_modules)', filename.indexOf('periodicjs.ext.serverside_ra/node_modules'));
//     // console.log('---------')
//     // console.log('skip',filename,filename.indexOf('periodicjs.ext.serverside_ra') === -1
//     //   || filename.indexOf('periodicjs.ext.serverside_ra/node_modules') !==-1)
//     // console.log('---------')
//     // console.log(filename, 'filename.indexOf(periodicjs.ext.serverside_ra) === -1', filename.indexOf('periodicjs.ext.serverside_ra') === -1 );
//     // console.log(filename, 'filename.indexOf(periodicjs.ext.reactadmin) === -1', filename.indexOf('periodicjs.ext.reactadmin') === -1 );
//     if (
//       filename.indexOf('periodicjs.ext.serverside_ra') === -1
//       || filename.indexOf('periodicjs.ext.serverside_ra/node_modules') !== -1
//       // && filename.indexOf('periodicjs.ext.reactadmin') === -1
//       // && filename.indexOf('periodicjs.ext.reactadmin/node_modules') === 0
//     ) {
//       return true;
//     } else {
//       console.log('process',filename)
//       return false;
//     }
//   },
// });
// require('babel-register');
// require('css-modules-require-hook/preset');
const serverside_ra_router = require('./router');
// npm i babel-register css-modules-require-hook/preset --save
// npm i babel-preset-react babel-preset-es2015 babel-plugin-transform-runtime babel-plugin-transform-es2015-modules-commonjs babel-plugin-react-css-modules --save
module.exports = function (periodic) {
  console.log('------------')
  console.log('------------')
  console.log('------------')
  console.log('------------')
  console.log('use ssr router')
  console.log('------------')
  console.log('------------')
  periodic.app.use(serverside_ra_router(periodic));
  return periodic;
};