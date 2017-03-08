import test from '../test';
// import React from 'react';
// import { match } from 'react-router';
// import { renderToString } from 'react-dom/server';
// import { RouterContext } from 'react-router';
// npm i babel-register css-modules-require-hook/preset --save
module.exports = function (periodic) {
  const ssraRouter = periodic.express.Router();

  ssraRouter.get('/*', (req, res) => {
    res.send('babel works');
  })
  ssraRouter.get('/babel', (req, res) => {
    res.send('babel works');
  })

  return ssraRouter;
};