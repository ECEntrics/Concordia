import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingContainer from './components/LoadingContainer';
import Routes from './Routes';

// CSS
import './assets/css/app.css';

const App = ({ store }) => (
    <Provider store={store}>
        <LoadingContainer>
            <Router>
                <Routes />
            </Router>
        </LoadingContainer>
    </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired,
};

export default App;
