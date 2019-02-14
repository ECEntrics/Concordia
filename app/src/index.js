import React from "react";
import { render } from "react-dom";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";
import drizzleOptions from "./config/drizzleOptions";
import AppContainer from "./containers/AppContainer";
import store from './redux/store';

import * as serviceWorker from "./utils/serviceWorker";

render(
    <DrizzleProvider options={drizzleOptions} store={store}>
        <LoadingContainer>
            <AppContainer />
        </LoadingContainer>
    </DrizzleProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
