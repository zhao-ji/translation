export default (state = {}, action) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'GOOGLE_TRANSLATION_TRY': {
            newState.google.isLoading = true;
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
            newState.baidu.isLoading = true;
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
            newState.youdao.isLoading = true;
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
            newState.bing.isLoading = true;
            return newState
        }
        case 'BING_TRANSLATION_SUCCESS': {
            newState.bing = {
                result: action.result,
                isLoading: false
            }
            return newState
        }
        case 'BING_TRANSLATION_ERROR': {
            newState.bing.isLoading = false;
            return newState
        }
        default:
            return newState;
    }
}
