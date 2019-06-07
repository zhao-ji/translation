import axios from 'axios';
import { secrets } from './secrets';

export const recordActions = {
    record: kwargs => dispatch => {
        dispatch({ type: "RECORD_TRY", kwargs });

        if (!kwargs.text) {
            // empty search content
            return dispatch({ type: "RECORD_SUCCESS", kwargs });
        } else if (kwargs.isEnglish && kwargs.text.length < 2) {
            // we don't trigger the search if it's english and less than 2 characters
            return dispatch({ type: "RECORD_SUCCESS", kwargs });
        }

        axios.post(secrets.recordURL, { word: kwargs.text })
            .then(response => {
                dispatch({ type: "RECORD_SUCCESS", kwargs });
            })
            .catch(error => {
                dispatch({ type: "RECORD_ERROR", error: error, kwargs });
            })
    },
}
