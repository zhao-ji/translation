import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

function initialState() {
    return {
        translation: {
            google: {
                text: null,
                result: null,
                isLoading: false
            },
            baidu: {
                text: null,
                result: null,
                isLoading: false
            },
            youdao: {
                text: null,
                result: null,
                isLoading: false
            },
            bing: {
                text: null,
                result: null,
                isTranslationLoading: false,
                isExampleLoading: false
            },
            amazon: {
                text: null,
                result: null,
                isLoading: false
            },
            urban: {
                text: null,
                result: null,
                isLoading: false
            },
            oxford: {
                text: null,
                result: null,
                isLoading: false
            },
            oxfordExamples: {
                text: null,
                result: [],
                isLoading: false
            },
            webster: {
                text: null,
                result: null,
                isLoading: false
            },
        },
        recordResult: {
            isSuccess: null,
            isLoading: null,
        },
        utils: {
            currentText: null,
            cache: {},
        },
    }
}

export default function configureStore() {
    return applyMiddleware(thunk)(createStore)(
        rootReducer,
        initialState(),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
}
