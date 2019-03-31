import React from 'react';
import App from './App';
import Main from './pages/Main';

export default [
  {
    ...App,
    routes: [
      {
        ...Main,
        path: '/',
        exact: true
      }
    ]
  }
];
