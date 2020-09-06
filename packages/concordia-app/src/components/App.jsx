import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LoadingContainer from './LoadingContainer'
import PropTypes from 'prop-types'
import NotFound from '../components/NotFound';

const App = ({ store }) => (
    <Provider store={store}>
        <LoadingContainer>
            <Router>
                <Switch>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </LoadingContainer>
    </Provider>
)

App.propTypes = {
    store: PropTypes.object.isRequired
}

export default App
