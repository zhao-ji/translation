import axios from 'axios';
import md5 from 'md5';

import { secrets } from './secrets';

export const translationActions = {
    googleTranslate: kwargs => dispatch => {
        dispatch({ type: "GOOGLE_TRANSLATION_TRY", kwargs });
        let args = {
            params: {
                key: secrets.googleKey,
                q: kwargs.text,
                from: kwargs.isEnglish ? "en" : "zh-cn",
                target: kwargs.isEnglish ? "zh-cn" : "en",
            }
        };
        axios
            .get(secrets.googleUrl, args)
            .then(response => {
                dispatch({ type: "GOOGLE_TRANSLATION_SUCCESS", result: response.data.data.translations[0].translatedText, kwargs });
            })
            .catch(error => {
                dispatch({ type: "GOOGLE_TRANSLATION_ERROR", error, kwargs });
            })
    },
    baiduTranslate: kwargs => dispatch => {
        dispatch({ type: "BAIDU_TRANSLATION_TRY", kwargs });

        const salt = Math.random() * 2 ** 16;
        let args = {
            params: {
                appid: secrets.baiduAppId,
                salt: salt,
                sign: md5(secrets.baiduAppId + kwargs.text + salt + secrets.baiduSecretKey),
                q: kwargs.text,
                from: kwargs.isEnglish ? "en" : "zh",
                to: kwargs.isEnglish ? "zh" : "en",
            }
        };
        axios.get(secrets.baiduUrl, args).then(response => {
            dispatch({ type: "BAIDU_TRANSLATION_SUCCESS", result: response.data.trans_result[0].dst, kwargs });
        }).catch(error => {
            dispatch({ type: "BAIDU_TRANSLATION_ERROR", error, kwargs });
        })
    },
    deeplTranslate: kwargs => dispatch => {
        dispatch({ type: "DEEPL_TRANSLATION_TRY", kwargs });
        let args = {
            params: {
                text: kwargs.text,
                source_lang: kwargs.isEnglish ? "EN" : "ZH",
                target_lang: kwargs.isEnglish ? "ZH" : "EN",
            }
        };
        axios
            .get(secrets.deeplUrl, args)
            .then(response => {
                dispatch({ type: "DEEPL_TRANSLATION_SUCCESS", result: response.data.translations[0].text, kwargs });
            })
            .catch(error => {
                dispatch({ type: "DEEPL_TRANSLATION_ERROR", error, kwargs });
            })
    },
    youdaoTranslate: kwargs => dispatch => {
        dispatch({ type: "YOUDAO_TRANSLATION_TRY", kwargs });

        let args = {
            params: {
                q: kwargs.text,
            }
        };
        axios.get(secrets.youdaoUrl, args).then(response => {
            dispatch({ type: "YOUDAO_TRANSLATION_SUCCESS", result: response.data, kwargs });
        }).catch(error => {
            dispatch({ type: "YOUDAO_TRANSLATION_ERROR", error, kwargs });
        })
    },
    bingTranslate: kwargs => dispatch => {
        dispatch({ type: "BING_TRANSLATION_TRY", kwargs });

        const data = [{
            text: kwargs.text
        }];
        const config = {
            headers: {
                "Ocp-Apim-Subscription-Key": secrets.bingKey1,
            },
            params: {
                "api-version": "3.0",
                from: kwargs.isEnglish ? "en" : "zh-Hans",
                to: kwargs.isEnglish ? "zh-Hans" : "en",
            },
        };

        if (kwargs.textType === "sentence") {
            return axios
                .post(secrets.bingTranslateUrl, data, config)
                .then(translateResponse => {
                    dispatch({
                        type: "BING_TRANSLATION_SUCCESS",
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                        },
                        kwargs
                    });
                })
                .catch(error => {
                    dispatch({ type: "BING_TRANSLATION_ERROR", error, kwargs });
                })
        }

        function getBingTranslation () {
            return axios.post(secrets.bingTranslateUrl, data, config)
        }
        function getBingDictionLookup () {
            return axios.post(secrets.bingDictionaryLookupUrl, data, config)
        }
        axios
            .all([getBingTranslation(), getBingDictionLookup()])
            .then(axios.spread((translateResponse, dictionaryResponse) => {
                const dictionary = dictionaryResponse.data[0].translations;
                if (dictionary.length === 0) {
                    dispatch({
                        type: "BING_TRANSLATION_SUCCESS",
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                            dictionary: dictionary,
                        },
                        kwargs
                    });
                    return
                }

                dispatch({
                    type: "BING_TRANSLATION_IN_PROGRESS",
                    result: {
                        translation: translateResponse.data[0].translations[0].text,
                        dictionary: dictionary,
                    },
                    kwargs
                });

                const exampleRequestData = dictionary.slice(0, 10).map(
                    item => ({
                        Text: kwargs.text,
                        Translation: item.normalizedTarget,
                    })
                );
                axios
                    .post(secrets.bingDictionaryExampleUrl, exampleRequestData, config)
                    .then(response => {
                        const dictionaryData = dictionary.map(
                            (item, index) => ({ ...item, ...response.data[index] })
                        );
                        dispatch({
                            type: "BING_TRANSLATION_SUCCESS",
                            result: {
                                translation: translateResponse.data[0].translations[0].text,
                                dictionary: dictionaryData,
                            },
                            kwargs
                        });
                    })
                    .catch(error => {
                        dispatch({ type: "BING_TRANSLATION_EXAMPLE_ERROR", error, kwargs });
                    })
            }))
            .catch(error => {
                dispatch({ type: "BING_TRANSLATION_ERROR", error, kwargs });
            })
    },
    amazonTranslate: kwargs => dispatch => {
        dispatch({ type: "AMAZON_TRANSLATION_TRY", kwargs });

        let args = {
            params: {
                text: kwargs.text,
                source: kwargs.isEnglish ? "en" : "zh",
                target: kwargs.isEnglish ? "zh" : "en",
            }
        };
        axios.get(secrets.amazonUrl, args).then(response => {
            dispatch({ type: "AMAZON_TRANSLATION_SUCCESS", result: response.data.result, kwargs });
        }).catch(error => {
            dispatch({ type: "AMAZON_TRANSLATION_ERROR", error, kwargs });
        })
    },
    caiyunTranslate: kwargs => dispatch => {
        dispatch({ type: "CAIYUN_TRANSLATION_TRY", kwargs });
        let data = {
            source: kwargs.text,
            trans_type: kwargs.isEnglish ? "en2zh" : "zh2en",
        };
        axios
            .post(secrets.caiyunUrl, data)
            .then(response => {
                dispatch({ type: "CAIYUN_TRANSLATION_SUCCESS", result: response.data.target, kwargs });
            })
            .catch(error => {
                dispatch({ type: "CAIYUN_TRANSLATION_ERROR", error, kwargs });
            })
    },
    urbanTranslate: kwargs => dispatch => {
        dispatch({ type: "URBAN_TRANSLATION_TRY", kwargs });

        let args = {
            params: {
                text: kwargs.text,
            }
        };
        axios.get(secrets.urbanDictionaryUrl, args).then(response => {
            dispatch({ type: "URBAN_TRANSLATION_SUCCESS", result: response.data.result, kwargs });
        }).catch(error => {
            dispatch({ type: "URBAN_TRANSLATION_ERROR", error, kwargs });
        })
    },
    chatgptTranslate: kwargs => dispatch => {
        dispatch({ type: "CHATGPT_TRANSLATION_TRY", kwargs });

        let args = {
            params: {
                text: kwargs.text,
                source: kwargs.isEnglish ? "en" : "zh",
                target: kwargs.isEnglish ? "zh" : "en",
            }
        };
        axios.get(secrets.chatgptUrl, args).then(response => {
            dispatch({ type: "CHATGPT_TRANSLATION_SUCCESS", result: response.data.result, kwargs });
        }).catch(error => {
            dispatch({ type: "CHATGPT_TRANSLATION_ERROR", error, kwargs });
        })
    },
    llama2Translate: kwargs => dispatch => {
        dispatch({ type: "LLAMA2_TRANSLATION_TRY", kwargs });

        let data = {
            text: kwargs.text,
            source_lang: kwargs.isEnglish ? "english" : "chinese",
            target_lang: kwargs.isEnglish ? "chinese" : "english",
        };
        axios.post(secrets.llama2Url, data).then(response => {
            dispatch({ type: "LLAMA2_TRANSLATION_SUCCESS", result: response.data.result, kwargs });
        }).catch(error => {
            dispatch({ type: "LLAMA2_TRANSLATION_ERROR", error, kwargs });
        })
    },
    oxfordTranslate: kwargs => dispatch => {
        dispatch({ type: "OXFORD_TRANSLATION_TRY", kwargs });

        axios
            .get(secrets.oxfordEntryUrl + kwargs.text.toLowerCase())
            .then(response => {
                dispatch({ type: "OXFORD_TRANSLATION_SUCCESS", result: response.data.results, kwargs });
            })
            .catch(error => {
                dispatch({ type: "OXFORD_TRANSLATION_ERROR", error, kwargs });
            })
    },
    oxfordFetchExamples: kwargs => dispatch => {
        dispatch({ type: "OXFORD_FETCH_EXAMPLES_TRY", kwargs });

        axios
        .get(secrets.oxfordSentenceUrl + kwargs.text.toLowerCase())
        .then(response => {
            dispatch({ type: "OXFORD_FETCH_EXAMPLES_SUCCESS", result: response.data.results, kwargs });
        })
        .catch(error => {
            dispatch({ type: "OXFORD_FETCH_EXAMPLES_ERROR", error, kwargs });
        })
    },
    websterTranslate: kwargs => dispatch => {
        dispatch({ type: "WEBSTER_TRANSLATION_TRY", kwargs });

        const config = {
            params: {
                key: secrets.websterKey,
            },
        };
        axios
            .get(secrets.websterUrl + kwargs.text.toLowerCase(), config)
            .then(response => {
                dispatch({ type: "WEBSTER_TRANSLATION_SUCCESS", result: response.data, kwargs });
            })
            .catch(error => {
                dispatch({ type: "WEBSTER_TRANSLATION_ERROR", error, kwargs });
            })
    },
    longmanTranslate: kwargs => dispatch => {
        dispatch({ type: "LONGMAN_TRANSLATION_TRY", kwargs });

        const config = {
            params: {
                apikey: secrets.longmanKey,
                headword: kwargs.text,
            },
        };
        axios
            .get(secrets.longmanUrl, config)
            .then(response => {
                dispatch({ type: "LONGMAN_TRANSLATION_SUCCESS", result: response.data.results, kwargs });
            })
            .catch(error => {
                dispatch({ type: "LONGMAN_TRANSLATION_ERROR", error, kwargs });
            })
    },
    cleanEnEnResult: kwargs => dispatch => {
        dispatch({ type: "CLEAN_EN_EN_RESULT", kwargs });
    },
}
