import axios from 'axios';
import { secrets } from './secrets';

export const recordActions = {
    record: kwargs => dispatch => {
        dispatch({ type: "RECORD_TRY", kwargs });
        let formData = new FormData();
        formData.set('word', kwargs.text);
        axios({
            method: 'post',
            url: secrets.recordURL,
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(response => {
            dispatch({
                type: "RECORD_SUCCESS",
                kwargs
            });
        }).catch(error => {
            dispatch({ type: "RECORD_ERROR", error: error, kwargs });
        })
    },
}
