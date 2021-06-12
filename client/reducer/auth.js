
const AUTH_ADMIN = 'auth/admin';

// 액션 생성 함수 정의
export const setAuth = (isAdmin) => ({ type: AUTH_ADMIN, isAdmin })

// 초기 상태 정의
const initialState = { isAdmin: false };
export default function auth(state = initialState, action) {
   switch (action.type) {
      case AUTH_ADMIN:
         return {
            ...state,
            isAdmin: action.isAdmin || false,
         };
      default:
         return state;
   }
}