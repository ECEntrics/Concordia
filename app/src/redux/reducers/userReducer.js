import { AUTH_USER_DATA_UPDATED, GUEST_USER_DATA_UPDATED } from '../actions/userActions';

const initialState = {
  username: '',
  address: '0x0',
  avatarUrl: '',
  hasSignedUp: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_USER_DATA_UPDATED:
      return {
        username: action.username,
        address: action.address,
        hasSignedUp: true
      };
    case GUEST_USER_DATA_UPDATED:
      return {
        username: '',
        address: action.address,
        hasSignedUp: false
      };
    default:
      return state;
  }
};

export default userReducer;
