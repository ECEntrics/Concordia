import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router'

import createRootReducer from './reducers/routerReducer';

export const history = createBrowserHistory();

const rootReducer = createRootReducer(history);

const initialState = {};

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(history);


const composedEnhancers = composeEnhancers(applyMiddleware(routingMiddleware));

const routerStore = createStore(
    rootReducer,
    initialState,
    composedEnhancers
);

export default routerStore;