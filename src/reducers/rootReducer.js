import { combineReducers } from 'redux';
import translation from './translationReducer';
import record from './recordReducer';

export default combineReducers({
    translation: translation,
    record: record,
})
