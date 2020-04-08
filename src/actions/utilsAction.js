import axios from 'axios';
import { secrets } from './secrets';

export const utilsActions = {
    cleanCache: kwargs => dispatch => {
        dispatch({ type: "CLEAN_CACHE", kwargs });
    },
    setCurrentText: kwargs => dispatch => {
        dispatch({ type: "SET_CURRENT_TEXT", kwargs });
    },
    fetchSuggestion: kwargs => dispatch => {
        dispatch({ type: "FETCH_SUGGESTION_TRY", kwargs });

        let args = {
            params: {
                s: kwargs.text,
            }
        };
        axios
            .get(secrets.datamuseUrl, args)
            .then(response => {
                dispatch({
                    type: "FETCH_SUGGESTION_SUCCESS",
                    result: response.data.map(item => item.word),
                    kwargs
                });
            })
            .catch(error => {
                dispatch({ type: "FETCH_SUGGESTION_ERROR", error, kwargs });
            })
    },
}
