export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'GOOGLE_TRANSLATION_TRY': {
            newState.google = {
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'GOOGLE_TRANSLATION_SUCCESS': {
            newState.google = {
                result: action.result,
                isLoading: false
            }
            return newState
        }
        case 'GOOGLE_TRANSLATION_ERROR': {
            newState.google.isLoading = false;
            return newState
        }
        case 'BAIDU_TRANSLATION_TRY': {
            newState.baidu = {
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'BAIDU_TRANSLATION_SUCCESS': {
            newState.baidu = {
                result: action.result,
                isLoading: false
            }
            return newState
        }
        case 'BAIDU_TRANSLATION_ERROR': {
            newState.baidu.isLoading = false;
            return newState
        }
        case 'YOUDAO_TRANSLATION_TRY': {
            newState.youdao = {
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'YOUDAO_TRANSLATION_SUCCESS': {
            newState.youdao = {
                result: action.result,
                isLoading: false
            }
            return newState
        }
        case 'YOUDAO_TRANSLATION_ERROR': {
            newState.youdao.isLoading = false;
            return newState
        }
        case 'BING_TRANSLATION_TRY': {
            newState.bing = {
                result: null,
                isTranslationLoading: true,
                isExampleLoading: true,
            };
            return newState
        }
        case 'BING_TRANSLATION_IN_PROGRESS': {
            newState.bing = {
                result: action.result,
                isTranslationLoading: false,
                isExampleLoading: true
            }
            return newState
        }
        case 'BING_TRANSLATION_SUCCESS': {
            newState.bing = {
                result: action.result,
                isTranslationLoading: false,
                isExampleLoading: false
            }
            return newState
        }
        case 'BING_TRANSLATION_EXAMPLE_ERROR': {
            newState.bing.isExampleLoading = false;
            return newState
        }
        case 'BING_TRANSLATION_ERROR': {
            newState.bing.isTranslationLoading = true;
            newState.bing.isExampleLoading = false;
            return newState
        }
        case 'OXFORD_TRANSLATION_TRY': {
            newState.oxford = {
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'OXFORD_TRANSLATION_SUCCESS': {
            newState.oxford = {
                result: action.result,
                isLoading: false
            }
            return newState
        }
        case 'OXFORD_TRANSLATION_ERROR': {
            newState.oxford.isLoading = false;
            return newState
        }
        default:
            return newState;
    }
}
