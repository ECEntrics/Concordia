import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from "./containers/NavBar";
import HomeContainer from './containers/HomeContainer'
import SignUpContainer from './containers/SignUpContainer'
import NotFound from './components/NotFound'


const routes = (
    <div>
        <NavBar />
        <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route component={NotFound} />
        </Switch>
    </div>
);

export default routes