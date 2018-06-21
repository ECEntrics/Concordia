//Action creators

export const SHOW_PROGRESS_BAR = 'SHOW_PROGRESS_BAR';
export const HIDE_PROGRESS_BAR = 'HIDE_PROGRESS_BAR';
export const SET_NAVBAR_TITLE = 'SET_NAVBAR_TITLE';

export function showProgressBar(){
    return { type: SHOW_PROGRESS_BAR};
}

export function hideProgressBar(){
    return { type: HIDE_PROGRESS_BAR};
}

export function setNavBarTitle(newTitle){
    return {
        type: SET_NAVBAR_TITLE,
        title: newTitle
    };
}