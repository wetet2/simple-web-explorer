
import { ADD_TOAST } from './actions'

let refreshFlag = false; // componentDidUpdate 발생시키기 위해 사용
export const addToast = (message) => ({ type: ADD_TOAST, message })

export default function toast(state = {}, action) {
   switch (action.type) {
      case ADD_TOAST:
         refreshFlag = !refreshFlag;
         return {
            ...state,
            message: action.message,
            refreshFlag,
         };
      default:
         return state;

   }
}