import { combineReducers } from 'redux';
import translation from './translationReducer';
import recordResult from './recordReducer';
import utils from './utilsReducer';

export default combineReducers({
    translation: translation,
    recordResult: recordResult,
    utils: utils,
})
