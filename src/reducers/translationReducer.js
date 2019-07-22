export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'GOOGLE_TRANSLATION_TRY': {
            newState.google = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'GOOGLE_TRANSLATION_SUCCESS': {
            newState.google.result = action.result;
            newState.google.isLoading = false;
            return newState
        }
        case 'GOOGLE_TRANSLATION_ERROR': {
            newState.google.isLoading = false;
            return newState
        }
        case 'BAIDU_TRANSLATION_TRY': {
            newState.baidu = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'BAIDU_TRANSLATION_SUCCESS': {
            newState.baidu.result = action.result;
            newState.baidu.isLoading = false;
            return newState
        }
        case 'BAIDU_TRANSLATION_ERROR': {
            newState.baidu.isLoading = false;
            return newState
        }
        case 'YOUDAO_TRANSLATION_TRY': {
            newState.youdao = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'YOUDAO_TRANSLATION_SUCCESS': {
            newState.youdao.result = action.result;
            newState.youdao.isLoading = false;
            return newState
        }
        case 'YOUDAO_TRANSLATION_ERROR': {
            newState.youdao.isLoading = false;
            return newState
        }
        case 'BING_TRANSLATION_TRY': {
            newState.bing = {
                text: action.kwargs.text,
                result: null,
                isTranslationLoading: true,
                isExampleLoading: true,
            };
            return newState
        }
        case 'BING_TRANSLATION_SUCCESS': {
            newState.bing.result = action.result;
            newState.bing.isTranslationLoading = false;
            newState.bing.isExampleLoading = false;
            return newState
        }
        case 'BING_TRANSLATION_ERROR': {
            newState.bing.isTranslationLoading = true;
            newState.bing.isExampleLoading = false;
            return newState
        }
        case 'BING_TRANSLATION_IN_PROGRESS': {
            newState.bing.result = action.result;
            newState.bing.isTranslationLoading = false;
            newState.bing.isExampleLoading = true;
            return newState
        }
        case 'BING_TRANSLATION_EXAMPLE_ERROR': {
            newState.bing.isExampleLoading = false;
            return newState
        }
        case 'OXFORD_TRANSLATION_TRY': {
            newState.oxford = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'OXFORD_TRANSLATION_SUCCESS': {
            newState.oxford.result = action.result;
            newState.oxford.isLoading = false;
            return newState
        }
        case 'OXFORD_TRANSLATION_ERROR': {
            newState.oxford.isLoading = false;
            return newState
        }
        case 'OXFORD_FETCH_EXAMPLES_TRY': {
            newState.oxfordExamples = {
                text: action.kwargs.text,
                result: [],
                isLoading: true
            };
            return newState
        }
        case 'OXFORD_FETCH_EXAMPLES_SUCCESS': {
            newState.oxfordExamples.result = action.result;
            newState.oxfordExamples.isLoading = false;
            return newState
        }
        case 'OXFORD_FETCH_EXAMPLES_ERROR': {
            newState.oxfordExamples.isLoading = false;
            return newState
        }
        case 'WEBSTER_TRANSLATION_TRY': {
            newState.webster = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'WEBSTER_TRANSLATION_SUCCESS': {
            newState.webster.result = action.result;
            newState.webster.isLoading = false;
            return newState
        }
        case 'WEBSTER_TRANSLATION_ERROR': {
            newState.webster.isLoading = false;
            return newState
        }
        default:
            return newState;
    }
}
