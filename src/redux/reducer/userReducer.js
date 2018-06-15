const initialState = {
    username: "",
    address: "0x0",
    avatarUrl: "",
    hasSignedUp: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_HAS_SIGNED_UP':
            return {
                username: action.username,
                address: action.address,
                hasSignedUp: true
            };
        case 'USER_IS_GUEST':
            return {
                username: "",
                address: action.address,
                hasSignedUp: false
            };
        default:
            return state
    }
};

export default userReducer;