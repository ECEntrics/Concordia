import { USER_DATA_UPDATED } from '../actions/userActions';

const initialState = {
  username: '',
  address: null,
  hasSignedUp: false,
};

const userReducer = (state = initialState, action) => {
  const { type } = action;

  if (type === USER_DATA_UPDATED) {
    const { address, username } = action;
    if (username) {
      return {
        username,
        address,
        hasSignedUp: true,
      };
    }
    return {
      username: '',
      address,
      hasSignedUp: false,
    };
  }

  return state;
};

export default userReducer;
