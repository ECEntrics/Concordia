import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Drizzle } from '@ezerous/drizzle';
import { Breeze } from '@ezerous/breeze';
import App from './App';
import store from './redux/store';
import AppContext from './components/AppContext';
import drizzleOptions from './options/drizzleOptions';
import breezeOptions from './options/breezeOptions';
import * as serviceWorker from './utils/serviceWorker';
import './assets/css/index.css';
import LoadingScreen from './components/LoadingScreen';

const drizzle = new Drizzle(drizzleOptions, store);
const breeze = new Breeze(breezeOptions, store);

render(
    <Suspense fallback={<LoadingScreen />}>
        <AppContext.Provider drizzle={drizzle} breeze={breeze}>
            <App store={store} />
        </AppContext.Provider>
    </Suspense>,
    document.getElementById('root'),
);

serviceWorker.unregister(); // See also: http://bit.ly/CRA-PWA
