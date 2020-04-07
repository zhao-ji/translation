import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import App from './App';
import configureStore from './store';
import * as serviceWorker from './serviceWorker';

Sentry.init({
    dsn: "https://e1f7153491524405ba9f48f3af77449e@o374324.ingest.sentry.io/5192145"
});

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
