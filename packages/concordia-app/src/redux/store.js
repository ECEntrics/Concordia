import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  drizzleReducers, drizzleMiddlewares, generateContractsInitialState, Drizzle,
} from '@ezerous/drizzle';
import { Breeze, breezeReducers } from '@ezerous/breeze';
import createSagaMiddleware from 'redux-saga';
import getBreezeConfiguration from 'concordia-shared/src/configuration/breezeConfiguration';
import { EthereumContractIdentityProvider } from '@ezerous/eth-identity-provider';
import userReducer from './reducers/userReducer';
import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../options/drizzleOptions';
import peerDbReplicationReducer from './reducers/peerDbReplicationReducer';

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

const breezeConfiguration = getBreezeConfiguration(EthereumContractIdentityProvider,
  process.env.REACT_APP_RENDEZVOUS_HOST,
  process.env.REACT_APP_RENDEZVOUS_PORT);

export const drizzle = new Drizzle(drizzleOptions, store);
export const breeze = new Breeze(breezeConfiguration, store);

sagaMiddleware.run(rootSaga);
export default store;
