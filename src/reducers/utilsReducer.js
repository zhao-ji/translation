export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'CLEAN_CACHE': {
            newState.cache = {};
            return newState
        }
        case 'ADD_CACHE': {
            // cache = {
            //     "he": {
            //         "google": {},
            //         "bing": {}
            //     },
            //     "hello": {
            //         "google": {},
            //         "bing": {}
            //     }
            // }
            let cache;
            if (action.kwargs.text in newState.cache) {
                cache = newState.cache[action.kwargs.text];
            } else {
                cache = {};
            }
            cache[action.kwargs.source] = action.kwargs.result;
            newState.cache[action.kwargs.text] = cache;
            return newState
        }
        case 'SET_CURRENT_TEXT': {
            newState.currentText = action.kwargs.text;
            return newState
        }
        default:
            return newState;
    }
}
