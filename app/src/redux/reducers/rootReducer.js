import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import { connectRouter } from 'connected-react-router'
import userReducer from './userReducer';
import orbitReducer from "./orbitReducer";

export default (history) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    orbit: orbitReducer,
    ...drizzleReducers
})