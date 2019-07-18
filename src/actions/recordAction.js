import axios from 'axios';
import { secrets } from './secrets';

export const recordActions = {
    record: kwargs => dispatch => {
        dispatch({ type: "RECORD_TRY", kwargs });

        axios.post(secrets.recordUrl, { word: kwargs.text })
            .then(response => {
                dispatch({ type: "RECORD_SUCCESS", kwargs });
            })
            .catch(error => {
                dispatch({ type: "RECORD_ERROR", error: error, kwargs });
            })
    },
}
