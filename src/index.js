import React from 'react';
import App from './app/app';
import ReactDOM from 'react-dom';
import store from './app/app.store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import './app/app.i18n';
import './assets/css/style.css';
import 'react-toastify/dist/ReactToastify.css';
import './assets/css/custom-react-tostify.css';

/**
 * Main app.
 */
const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
serviceWorker.unregister();
