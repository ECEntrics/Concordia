import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { drizzleReducers, drizzleMiddlewares, generateContractsInitialState } from '@ezerous/drizzle';
import { breezeReducers, breezeMiddlewares } from '@ezerous/breeze'
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../options/drizzleOptions';

const initialState = {
    contracts: generateContractsInitialState(drizzleOptions),
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {...drizzleReducers, ...breezeReducers },
    middleware: getDefaultMiddleware({
        serializableCheck: false,   //https://redux.js.org/style-guide/style-guide/#do-not-put-non-serializable-values-in-state-or-actions
    }).concat(drizzleMiddlewares).concat(breezeMiddlewares).concat(sagaMiddleware),
    preloadedState: initialState
})

sagaMiddleware.run(rootSaga);
export default store;
