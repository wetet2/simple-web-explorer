
import { combineReducers } from 'redux';
import auth from './auth';
import loading from './loadReducer';
import toast from './toastReducer';

export default combineReducers({
   auth,
   loading,
   toast,
})