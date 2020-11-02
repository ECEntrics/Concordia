import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { drizzleReducers, drizzleMiddlewares, generateContractsInitialState } from '@ezerous/drizzle';
import { breezeReducers } from '@ezerous/breeze';
import createSagaMiddleware from 'redux-saga';
import userReducer from './reducers/userReducer';
import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../options/drizzleOptions';

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions),
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { ...drizzleReducers, ...breezeReducers, user: userReducer },
  middleware: getDefaultMiddleware({
    // https://redux.js.org/style-guide/style-guide/#do-not-put-non-serializable-values-in-state-or-actions
    serializableCheck: false,
  }).concat(drizzleMiddlewares).concat(sagaMiddleware),
  preloadedState: initialState,
});

sagaMiddleware.run(rootSaga);
export default store;
