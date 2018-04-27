import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import userReducer from './user/userReducer'

const reducer = combineReducers({
  routing: routerReducer,
  ...drizzleReducers,
  user: userReducer,
});

export default reducer
