import axios from 'axios';
import md5 from 'md5';

import { secrets } from './secrets';

export const translationActions = {
    googleTranslate: kwargs => dispatch => {
        dispatch({ type: "GOOGLE_TRANSLATION_TRY", kwargs });
        if (!kwargs.text || kwargs.text.length < 2) {
            return dispatch({ type: "GOOGLE_TRANSLATION_SUCCESS", result: "", kwargs });
        }

        let args = {
            params: {
                key: secrets.googleKey,
                q: kwargs.text,
                from: kwargs.origin === "english" ? "en" : "zh-cn",
                target: kwargs.destination === "english" ? "en" : "zh-cn",
            }
        };
        axios.get(secrets.googleUrl, args).then(response => {
            dispatch({
                type: "GOOGLE_TRANSLATION_SUCCESS",
                result: response.data.data.translations[0].translatedText,
                kwargs
            });
        }).catch(error => {
            dispatch({ type: "GOOGLE_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    baiduTranslate: kwargs => dispatch => {
        dispatch({ type: "BAIDU_TRANSLATION_TRY", kwargs });
        if (!kwargs.text || kwargs.text.length < 2) {
            return dispatch({ type: "BAIDU_TRANSLATION_SUCCESS", result: "", kwargs });
        }

        const salt = Math.random() * 2 ** 16;
        let args = {
            params: {
                appid: secrets.baiduAppId,
                salt: salt,
                sign: md5(secrets.baiduAppId + kwargs.text + salt + secrets.baiduSecretKey),
                q: kwargs.text,
                from: kwargs.origin === "english" ? "en" : "zh",
                to: kwargs.destination === "english" ? "en" : "zh",
            }
        };
        axios.get(secrets.baiduUrl, args).then(response => {
            dispatch({
                type: "BAIDU_TRANSLATION_SUCCESS",
                result: response.data.trans_result[0].dst,
                kwargs
            });
        }).catch(error => {
            dispatch({ type: "BAIDU_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    youdaoTranslate: kwargs => dispatch => {
        dispatch({ type: "YOUDAO_TRANSLATION_TRY", kwargs });
        if (!kwargs.text || kwargs.text.length < 2) {
            return dispatch({ type: "YOUDAO_TRANSLATION_SUCCESS", result: "", kwargs });
        }

        let args = {
            params: {
                key: secrets.youdaoKey,
                keyfrom: secrets.youdaoKeyFrom,
                type: "data",
                doctype: "json",
                version: "1.1",
                q: kwargs.text,
            }
        };
        axios.get(secrets.youdaoUrl, args).then(response => {
            dispatch({
                type: "YOUDAO_TRANSLATION_SUCCESS",
                result: response.data,
                kwargs
            });
        }).catch(error => {
            dispatch({ type: "YOUDAO_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
    bingTranslate: kwargs => dispatch => {
        dispatch({ type: "BING_TRANSLATION_TRY", kwargs });
        if (!kwargs.text || kwargs.text.length < 2) {
            return dispatch({ type: "BING_TRANSLATION_SUCCESS", result: "", kwargs });
        }

        const data = [{
            text: kwargs.text
        }];
        const config = {
            headers: {
                "Ocp-Apim-Subscription-Key": secrets.bingKey1,
            },
            params: {
                "api-version": "3.0",
                from: kwargs.origin === "english" ? "en" : "zh-Hans",
                to: kwargs.destination === "english" ? "en" : "zh-Hans",
            },
        };
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
                    return dispatch({
                        type: "BING_TRANSLATION_SUCCESS",
                        result: {
                            translation: translateResponse.data[0].translations[0].text,
                            dictionary: dictionary,
                        },
                        kwargs
                    });
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
                    })
                    .catch(error => {
                        dispatch({ type: "BING_TRANSLATION_EXAMPLE_ERROR", error: error, kwargs });
                    })
            }))
            .catch(error => {
                dispatch({ type: "BING_TRANSLATION_ERROR", error: error, kwargs });
            })
    },
}
