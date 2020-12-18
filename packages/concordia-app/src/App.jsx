import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import InitializationScreen from './components/InitializationScreen';
import Routes from './Routes';
import './intl/index';
import 'semantic-ui-css/semantic.min.css';

const App = ({ store }) => (
    <Provider store={store}>
        <InitializationScreen>
            <Router>
                <Routes />
            </Router>
        </InitializationScreen>
    </Provider>
);

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired,
};

export default App;
