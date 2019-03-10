//Action creators

export const SET_NAVBAR_TITLE = 'SET_NAVBAR_TITLE';

export function setNavBarTitle(newTitle){
    return {
        type: SET_NAVBAR_TITLE,
        title: newTitle
    };
}
