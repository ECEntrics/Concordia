import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { generateContractsInitialState } from 'drizzle';

import drizzleReducer from './reducers/drizzleReducer';
import rootSaga from './sagas/drizzleSaga';
import drizzleOptions from '../config/drizzleOptions';

const initialState = { contracts: generateContractsInitialState(drizzleOptions) };

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const composedEnhancers = composeEnhancers(applyMiddleware(sagaMiddleware));

const store = createStore(
    drizzleReducer,
    initialState,
    composedEnhancers
);

sagaMiddleware.run(rootSaga);

export default store;