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
                from: kwargs.origin === "english" ? "en" : "zh-cn",
                target: kwargs.destination === "english" ? "en" : "zh-cn",
            }
        };
        axios.get("https://www.googleapis.com/language/translate/v2", args).then(response => {
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
        axios.get("http://fanyi.youdao.com/openapi.do", args).then(response => {
            dispatch({
                type: "YOUDAO_TRANSLATION_SUCCESS",
                result: response.data,
                kwargs
            });
        }).catch(error => {
            dispatch({ type: "YOUDAO_TRANSLATION_ERROR", error: error, kwargs });
        })
    },
}
