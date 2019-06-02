export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'RECORD_TRY': {
            newState.isLoading = true;
            return newState
        }
        case 'RECORD_SUCCESS': {
            newState.isLoading = false;
            newState.isSuccess = true;
            return newState
        }
        case 'RECORD_ERROR': {
            newState.isLoading = false;
            newState.isSuccess = false;
            return newState
        }
        default:
            return newState;
    }
}
