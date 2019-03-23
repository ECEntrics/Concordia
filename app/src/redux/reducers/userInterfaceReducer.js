import { SET_NAVBAR_TITLE } from '../actions/userInterfaceActions';

const initialState = {
  navBarTitle: ''
};

const userInterfaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NAVBAR_TITLE:
      return {
        navBarTitle: action.title
      };
    default:
      return state;
  }
};

export default userInterfaceReducer;
