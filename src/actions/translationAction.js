import axios from 'axios';
import md5 from 'md5';

import { secrets } from './secrets';
import { utilsActions } from './utilsAction';

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
        axios.get(secrets.googleUrl, args).then(response => {
            dispatch({
                type: "GOOGLE_TRANSLATION_SUCCESS",
                result: response.data.data.translations[0].translatedText,
                kwargs
            });
            dispatch(utilsActions.addCache({
                source: "google",
                text: kwargs.text,
                result: response.data.data.translations[0].translatedText,
            }));
        }).catch(error => {
            console.error(error);
            dispatch({ type: "GOOGLE_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    googleTranslateFromCache: kwargs => dispatch => {
        dispatch({ type: "GOOGLE_TRANSLATION_TRY", kwargs });
        dispatch({
            type: "GOOGLE_TRANSLATION_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
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
            dispatch({
                type: "BAIDU_TRANSLATION_SUCCESS",
                result: response.data.trans_result[0].dst,
                kwargs
            });
            dispatch(utilsActions.addCache({
                source: "baidu",
                text: kwargs.text,
                result: response.data.trans_result[0].dst,
            }));
        }).catch(error => {
            console.error(error);
            dispatch({ type: "BAIDU_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    baiduTranslateFromCache: kwargs => dispatch => {
        dispatch({ type: "BAIDU_TRANSLATION_TRY", kwargs });
        dispatch({
            type: "BAIDU_TRANSLATION_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
    },
    youdaoTranslate: kwargs => dispatch => {
        dispatch({ type: "YOUDAO_TRANSLATION_TRY", kwargs });

        let args = {
            params: {
                q: kwargs.text,
            }
        };
        axios.get(secrets.youdaoUrl, args).then(response => {
            dispatch({
                type: "YOUDAO_TRANSLATION_SUCCESS",
                result: response.data,
                kwargs
            });
            dispatch(utilsActions.addCache({
                source: "youdao",
                text: kwargs.text,
                result: response.data,
            }));
        }).catch(error => {
            console.error(error);
            dispatch({ type: "YOUDAO_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    youdaoTranslateFromCache: kwargs => dispatch => {
        dispatch({ type: "YOUDAO_TRANSLATION_TRY", kwargs });
        dispatch({
            type: "YOUDAO_TRANSLATION_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
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

        if (kwargs.isSentence) {
            return axios.post(secrets.bingTranslateUrl, data, config)
                .then(translateResponse => {
                    dispatch({
                        type: "BING_TRANSLATION_SUCCESS",
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                        },
                        kwargs
                    });
                    dispatch(utilsActions.addCache({
                        source: "bing",
                        text: kwargs.text,
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                        }
                    }));
                })
                .catch(error => {
                    console.error(error);
                    dispatch({ type: "BING_TRANSLATION_ERROR", error: error, kwargs });
                })
        }

        function getBingTranslation () {
            return axios.post(secrets.bingTranslateUrl, data, config)
        }
        function getBingDictionLookup () {
            return axios.post(secrets.bingDictionaryLookupUrl, data, config)
        }
        axios.all([getBingTranslation(), getBingDictionLookup()])
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
                    dispatch(utilsActions.addCache({
                        source: "bing",
                        text: kwargs.text,
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                            dictionary: dictionary,
                        },
                    }));
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

                const exampleRequestData = dictionary.map(
                    item => ({
                        Text: kwargs.text,
                        Translation: item.normalizedTarget,
                    })
                );
                axios.post(secrets.bingDictionaryExampleUrl, exampleRequestData, config)
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
                        dispatch(utilsActions.addCache({
                            source: "bing",
                            text: kwargs.text,
                            result: {
                                translation: translateResponse.data[0].translations[0].text,
                                dictionary: dictionaryData,
                            },
                        }));
                    })
                    .catch(error => {
                        console.error(error);
                        dispatch({ type: "BING_TRANSLATION_EXAMPLE_ERROR", error: error, kwargs });
                    })
            }))
            .catch(error => {
                console.error(error);
                dispatch({ type: "BING_TRANSLATION_ERROR", error: error, kwargs });
            })
    },
    bingTranslateFromCache: kwargs => dispatch => {
        dispatch({ type: "BING_TRANSLATION_TRY", kwargs });
        dispatch({
            type: "BING_TRANSLATION_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
    },
    oxfordTranslate: kwargs => dispatch => {
        dispatch({ type: "OXFORD_TRANSLATION_TRY", kwargs });

        axios.get(secrets.oxfordEntryUrl + kwargs.text.toLowerCase()).then(response => {
            dispatch({
                type: "OXFORD_TRANSLATION_SUCCESS",
                result: response.data.results,
                kwargs
            });
            dispatch(utilsActions.addCache({
                source: "oxford",
                text: kwargs.text,
                result: response.data.results,
            }));
        }).catch(error => {
            console.error(error);
            dispatch({ type: "OXFORD_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    oxfordTranslateFromCache: kwargs => dispatch => {
        dispatch({ type: "OXFORD_TRANSLATION_TRY", kwargs });
        dispatch({
            type: "OXFORD_TRANSLATION_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
    },
    oxfordFetchExamples: kwargs => dispatch => {
        dispatch({ type: "OXFORD_FETCH_EXAMPLES_TRY", kwargs });

        axios.get(secrets.oxfordSentenceUrl + kwargs.text.toLowerCase()).then(response => {
            dispatch({
                type: "OXFORD_FETCH_EXAMPLES_SUCCESS",
                result: response.data.results,
                kwargs
            });
            dispatch(utilsActions.addCache({
                source: "oxfordExamples",
                text: kwargs.text,
                result: response.data.results,
            }));
        }).catch(error => {
            console.error(error);
            dispatch({ type: "OXFORD_FETCH_EXAMPLES_ERROR", error: error, kwargs });
        })
    },
    oxfordFetchExamplesFromCache: kwargs => dispatch => {
        dispatch({ type: "OXFORD_FETCH_EXAMPLES_TRY", kwargs });
        dispatch({
            type: "OXFORD_FETCH_EXAMPLES_SUCCESS",
            result: kwargs.cache,
            kwargs
        });
    },
}
