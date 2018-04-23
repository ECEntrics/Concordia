import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { DrizzleProvider } from 'drizzle-react'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated, UserIsNotAuthenticated } from './util/wrappers.js'

// Layouts
import App from './App'
import HomeContainer from './layouts/home/HomeContainer'
import Dashboard from './layouts/dashboard/Dashboard'
import SignUp from './user/layouts/signup/SignUp'
import Profile from './user/layouts/profile/Profile'
import {LoadingContainer} from 'drizzle-react-components'

import './index.css';   //???

// Redux Store
import store from './store'
import drizzleOptions from './util/drizzle/drizzleOptions'

// ServiceWorker
import registerServiceWorker from './registerServiceWorker';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
        <DrizzleProvider options={drizzleOptions} store={store}>
            <LoadingContainer>
                <Router history={history}>
                    <Route path="/" component={App}>
                        <IndexRoute component={HomeContainer} />
                            <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
                            <Route path="signup" component={UserIsNotAuthenticated(SignUp)} />
                            <Route path="profile" component={UserIsAuthenticated(Profile)} />
                    </Route>
                </Router>
            </LoadingContainer>
        </DrizzleProvider>
    ),
    document.getElementById('root')
);

registerServiceWorker();

