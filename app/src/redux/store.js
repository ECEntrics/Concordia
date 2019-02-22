import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga';
import {Drizzle, generateContractsInitialState} from 'drizzle';
import {routerMiddleware} from 'connected-react-router';

import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../config/drizzleOptions';
import createRootReducer from './reducers/rootReducer';


export const history = createBrowserHistory();

const rootReducer = createRootReducer(history);

const initialState = { contracts: generateContractsInitialState(drizzleOptions) };

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const routingMiddleware = routerMiddleware(history);
const composedEnhancers = composeEnhancers(applyMiddleware(sagaMiddleware, routingMiddleware));

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

sagaMiddleware.run(rootSaga);

export default store;