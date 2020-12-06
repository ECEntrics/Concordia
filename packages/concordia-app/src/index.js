import React from 'react';
import { render } from 'react-dom';
import App from './components/App'
import store from './redux/store';
import { Drizzle } from '@ezerous/drizzle'
import { Breeze } from '@ezerous/breeze'

import AppContext from "./components/AppContext";

import drizzleOptions from './options/drizzleOptions';
import * as serviceWorker from './utils/serviceWorker';

import './assets/css/index.css';
import breezeOptions from './options/breezeOptions';

const drizzle = new Drizzle(drizzleOptions, store);
const breeze = new Breeze(breezeOptions, store);

render(
        <AppContext.Provider drizzle={drizzle} breeze={breeze}>
            <App store={store} />
        </AppContext.Provider>,
    document.getElementById('root')
);

serviceWorker.unregister(); // See also: http://bit.ly/CRA-PWA



