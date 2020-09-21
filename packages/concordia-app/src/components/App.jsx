import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoadingContainer from './LoadingContainer'
import PropTypes from 'prop-types'

// CSS
import '../assets/css/app.css';

import CoreLayoutContainer from './CoreLayoutContainer';
import HomeContainer from './HomeContainer';
import NotFound from '../components/NotFound';


const App = ({ store }) => (
    <Provider store={store}>
        <LoadingContainer>
                <Router>
                    <CoreLayoutContainer>
                        <Switch>
                            <Route exact path="/" component={HomeContainer} />
                            <Route component={NotFound} />
                        </Switch>
                    </CoreLayoutContainer>
                </Router>
        </LoadingContainer>
    </Provider>
)

App.propTypes = {
    store: PropTypes.object.isRequired
}

export default App
