import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBarContainer from "./containers/NavBarContainer";
import HomeContainer from './containers/HomeContainer'
import SignUpContainer from './containers/SignUpContainer'
import NotFound from './components/NotFound'


const routes = (
    <div>
        <NavBarContainer />
        <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route component={NotFound} />
        </Switch>
    </div>
);

export default routes