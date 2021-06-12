import React from 'react';
import ReactDOM from 'react-dom';
import App from './shared/App';

import './main.scss';

import 'moment/locale/ko';
import moment from 'moment';
moment.locale('ko');
moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
import { Provider } from 'react-redux';

import store from './store';

let rootElement = document.getElementById('root_main');
ReactDOM.render(
   <Provider store={store}>
      <React.StrictMode>
         <App />
      </React.StrictMode>
   </Provider>
   ,
   rootElement
);
