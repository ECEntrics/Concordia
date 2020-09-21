import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { drizzleReducers, drizzleMiddlewares, generateContractsInitialState } from '@ezerous/drizzle';
import { breezeReducers } from '@ezerous/breeze'
import userReducer from './reducers/userReducer'
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import drizzleOptions from '../options/drizzleOptions';

const initialState = {
    contracts: generateContractsInitialState(drizzleOptions),
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {...drizzleReducers, ...breezeReducers, user: userReducer },
    middleware: getDefaultMiddleware({
        serializableCheck: false,   //https://redux.js.org/style-guide/style-guide/#do-not-put-non-serializable-values-in-state-or-actions
    }).concat(drizzleMiddlewares).concat(sagaMiddleware),
    preloadedState: initialState
})

sagaMiddleware.run(rootSaga);
export default store;
