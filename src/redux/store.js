import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducer/reducer'
import rootSaga from './sagas/rootSaga'
import createSagaMiddleware from 'redux-saga'
import { generateContractsInitialState } from 'drizzle'
import drizzleOptions from '../util/drizzleOptions'

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory);
const sagaMiddleware = createSagaMiddleware();

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions)
};

const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      routingMiddleware,
      sagaMiddleware
    )
  )
);

sagaMiddleware.run(rootSaga);

export default store;