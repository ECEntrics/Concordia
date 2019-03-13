import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import { connectRouter } from 'connected-react-router';
import userReducer from './userReducer';
import orbitReducer from './orbitReducer';
import userInterfaceReducer from './userInterfaceReducer';

export default history => combineReducers({
  router: connectRouter(history),
  user: userReducer,
  orbit: orbitReducer,
  interface: userInterfaceReducer,
  ...drizzleReducers
});
