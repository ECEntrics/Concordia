const initialState = {
    grabbed: false
};

const contractReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONTRACT_GRABBED':
            return {
                grabbed: true,
            };
        default:
            return state
    }
};

export default contractReducer
