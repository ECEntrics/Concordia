import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from 'drizzle'
import userReducer from "./userReducer";
import contractReducer from "./contractReducer";
import orbitReducer from "./util/orbitReducer";

const reducer = combineReducers({
    routing: routerReducer,
    user: userReducer,
    orbitDB: orbitReducer,
    forumContract: contractReducer,
    ...drizzleReducers
});

export default reducer
