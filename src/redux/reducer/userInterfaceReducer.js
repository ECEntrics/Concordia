import { SHOW_PROGRESS_BAR, HIDE_PROGRESS_BAR } from '../actions/userInterfaceActions';

const initialState = {
    displayProgressBar: false
};

const userInterfaceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_PROGRESS_BAR:
            return {
                displayProgressBar: true
            };
        case HIDE_PROGRESS_BAR:
            return {
                displayProgressBar: false
            };
        default:
            return state;
    }
};

export default userInterfaceReducer;