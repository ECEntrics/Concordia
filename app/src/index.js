import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router'
import { Drizzle } from 'drizzle';

import store, {history} from './redux/store';
import routes from './router/routes'
import { initIPFS } from './orbit'
import * as serviceWorker from './utils/serviceWorker';

import './assets/css/index.css';
import drizzleOptions from "./config/drizzleOptions";

initIPFS();

export const drizzle = new Drizzle(drizzleOptions, store);

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            { routes }
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister(); // See also: http://bit.ly/CRA-PWA
