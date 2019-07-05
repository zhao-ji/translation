export const utilsActions = {
    cleanCache: kwargs => dispatch => {
        dispatch({ type: "CLEAN_CACHE", kwargs });
    },
    addCache: kwargs => dispatch => {
        dispatch({ type: "ADD_CACHE", kwargs });
    },
    setCurrentText: kwargs => dispatch => {
        dispatch({ type: "SET_CURRENT_TEXT", kwargs });
    },
}
