import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  drizzleReducers, drizzleMiddlewares, generateContractsInitialState, Drizzle,
} from '@ezerous/drizzle';
import { Breeze, breezeReducers } from '@ezerous/breeze';
import createSagaMiddleware from 'redux-saga';
import userReducer from './reducers/userReducer';
import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../options/drizzleOptions';
import peerDbReplicationReducer from './reducers/peerDbReplicationReducer';
import breezeOptions from '../options/breezeOptions';

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions),
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    ...drizzleReducers, ...breezeReducers, user: userReducer, orbitData: peerDbReplicationReducer,
  },
  middleware: getDefaultMiddleware({
    // https://redux.js.org/style-guide/style-guide/#do-not-put-non-serializable-values-in-state-or-actions
    serializableCheck: false,
  }).concat(drizzleMiddlewares).concat(sagaMiddleware),
  preloadedState: initialState,
});

export const drizzle = new Drizzle(drizzleOptions, store);
export const breeze = new Breeze(breezeOptions, store);

sagaMiddleware.run(rootSaga);
export default store;
