import { ReportAPIErrorToSentry } from '../utils';

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
            ReportAPIErrorToSentry(action.error, "record", action.kwargs, state);
            return newState
        }
        default:
            return newState;
    }
}
