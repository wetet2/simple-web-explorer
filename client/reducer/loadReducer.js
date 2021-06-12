
import { SHOW_LOADING, HIDE_LOADING } from './actions'

export const showLoading = () => ({ type: SHOW_LOADING })
export const hideLoading = () => ({ type: HIDE_LOADING });

export default function loading(state = {}, action) {
   switch (action.type) {
      case SHOW_LOADING:
         return {
            ...state,
            show: true,
         };
      case HIDE_LOADING:
         return {
            ...state,
            show: false,
         };
      default:
         return state;
   }
}