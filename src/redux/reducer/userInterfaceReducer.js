import {
    SHOW_PROGRESS_BAR,
    HIDE_PROGRESS_BAR,
    SET_NAVBAR_TITLE
} from '../actions/userInterfaceActions';

const initialState = {
    displayProgressBar: false,
    navBarTitle: ''
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
        case SET_NAVBAR_TITLE:
            return {
                navBarTitle: action.title
            }
        default:
            return state;
    }
};

export default userInterfaceReducer;