// import '@babel/polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
import LoginComponent from './LoginComponent';

import './login.scss';

let rootElement = document.getElementById('root_login');
ReactDOM.render(<LoginComponent />, rootElement);
