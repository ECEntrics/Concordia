import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers/reducer';
import rootSaga from './sagas/rootSaga';
import createSagaMiddleware from 'redux-saga';
import { generateContractsInitialState } from 'drizzle';

import drizzleOptions from '../config/drizzleOptions';

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const initialState = {
    contracts: generateContractsInitialState(drizzleOptions)
};

const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
        applyMiddleware(
            sagaMiddleware
        )
    )
);

sagaMiddleware.run(rootSaga);

export default store;