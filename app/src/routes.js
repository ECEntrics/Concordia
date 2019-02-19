import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.js';
import NavBarContainer from './containers/NavBarContainer';
import HomeContainer from './containers/HomeContainer'
import SignUpContainer from './containers/SignUpContainer'
import NotFound from './components/NotFound'


const routes = (
    <div>
        <NavBarContainer />
        <Switch>
            <PrivateRoute exact path="/" component={HomeContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route component={NotFound} />
        </Switch>
    </div>
);

export default routes
