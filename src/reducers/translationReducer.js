import { ReportAPIErrorToSentry } from '../utils';

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
            ReportAPIErrorToSentry(action.error, "google", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "baidu", action.kwargs, state);
            return newState
        }
        case 'DEEPL_TRANSLATION_TRY': {
            newState.deepl = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'DEEPL_TRANSLATION_SUCCESS': {
            newState.deepl.result = action.result;
            newState.deepl.isLoading = false;
            return newState
        }
        case 'DEEPL_TRANSLATION_ERROR': {
            newState.deepl.isLoading = false;
            ReportAPIErrorToSentry(action.error, "deepl", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "youdao", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "bing", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "bing example", action.kwargs, state);
            return newState
        }
        case 'AMAZON_TRANSLATION_TRY': {
            newState.amazon = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'AMAZON_TRANSLATION_SUCCESS': {
            newState.amazon.result = action.result;
            newState.amazon.isLoading = false;
            return newState
        }
        case 'AMAZON_TRANSLATION_ERROR': {
            newState.amazon.isLoading = false;
            ReportAPIErrorToSentry(action.error, "amazon", action.kwargs, state);
            return newState
        }
        case 'URBAN_TRANSLATION_TRY': {
            newState.urban = {
                text: action.kwargs.text,
                result: null,
                isLoading: true
            };
            return newState
        }
        case 'URBAN_TRANSLATION_SUCCESS': {
            newState.urban.result = action.result.sort(function(a, b){
                return b.thumbs_up - a.thumbs_up;
            });
            newState.urban.isLoading = false;
            return newState
        }
        case 'URBAN_TRANSLATION_ERROR': {
            newState.urban.isLoading = false;
            ReportAPIErrorToSentry(action.error, "urban dictionary", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "oxford", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "oxford example", action.kwargs, state);
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
            ReportAPIErrorToSentry(action.error, "webster", action.kwargs, state);
            return newState
        }
        case 'CLEAN_EN_EN_RESULT': {
            newState.urban = {
                text: null,
                result: null,
                isLoading: false
            };
            newState.oxford = {
                text: null,
                result: null,
                isLoading: false
            };
            newState.oxfordExamples = {
                text: null,
                result: [],
                isLoading: false
            };
            newState.webster = {
                text: null,
                result: null,
                isLoading: false
            };
            return newState
        }
        default:
            return newState;
    }
}
