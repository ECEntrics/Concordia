import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import { connectRouter } from 'connected-react-router'
import userReducer from './userReducer';

export default (history) => combineReducers({
    router: connectRouter(history),
    user: userReducer,
    ...drizzleReducers
})