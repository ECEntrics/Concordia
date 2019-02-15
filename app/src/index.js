import React from "react";
import { render } from "react-dom";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";
import drizzleOptions from "./config/drizzleOptions";
import { ConnectedRouter } from 'connected-react-router'
import routerStore, {history} from './redux/routerStore';
import drizzleStore from './redux/drizzleStore';
import routes from './router/routes'

import * as serviceWorker from "./utils/serviceWorker";
import {Provider} from "react-redux";

render(
    <DrizzleProvider options={drizzleOptions} store={drizzleStore}>
        <Provider store={routerStore}>
            <LoadingContainer>
                <ConnectedRouter history={history}>
                    { routes }
                </ConnectedRouter>
            </LoadingContainer>
        </Provider>
    </DrizzleProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
