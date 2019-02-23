import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import NavBarContainer from '../containers/NavBarContainer';
import HomeContainer from '../containers/HomeContainer'
import SignUpContainer from '../containers/SignUpContainer'
import NotFound from '../components/NotFound'
import {drizzle} from '../index'

const routes = (
    <div>
        <NavBarContainer />
        <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Redirect from='/home' to="/" />
            <Route path="/signup" component={SignUpContainer} />
            <Route component={NotFound} />
        </Switch>
    </div>
);

export default routes
