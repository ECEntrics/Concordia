import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomeContainer from '../containers/HomeContainer'
import NotFound from '../components/NotFound'

const routes = (
    <div>
        <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route component={NotFound} />
        </Switch>
    </div>
);

export default routes


// const routes = (
//     <div>
//         <NavBar />
//         <Switch>
//             <Route exact path="/" component={Home} />
//             <Route path="/signup" component={SignUp} />
//             <Route component={NotFound} />
//         </Switch>
//     </div>
// );