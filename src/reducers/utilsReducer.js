import { ReportAPIErrorToSentry } from '../utils';

export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        /*
         * cache structrue
         *
         * cache = {
         *     "he": {
         *         isLoading: false,
         *         result: ["app", "apple", "application"]
         *     },
         *     "hello": {
         *         isLoading: true,
         *         result: []
         *     }
         * }
        */
        case 'CLEAN_CACHE': {
            newState.cache = {};
            return newState
        }
        case 'SET_CURRENT_TEXT': {
            newState.currentText = action.kwargs.text;
            return newState
        }
        case 'FETCH_SUGGESTION_TRY': {
            newState.cache[action.kwargs.text] = {
                isLoading: true,
                result: []
            };
            return newState
        }
        case 'FETCH_SUGGESTION_SUCCESS': {
            newState.cache[action.kwargs.text] = {
                isLoading: false,
                result: action.result
            };
            return newState
        }
        case 'FETCH_SUGGESTION_ERROR': {
            newState.cache[action.kwargs.text].isLoading = false;
            ReportAPIErrorToSentry(action.error, "suggestion", action.kwargs, state);
            return newState
        }
        default:
            return newState;
    }
}
