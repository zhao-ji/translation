import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

function initialState() {
    return {
        translation: {
            google: {
                result: null,
                isLoading: false
            },
            microsoft: {
                result: null,
                isLoading: false
            },
        },
    }
}

export default function configureStore() {
    return createStore(
        rootReducer,
        initialState(),
        applyMiddleware(thunk)
    );
}
