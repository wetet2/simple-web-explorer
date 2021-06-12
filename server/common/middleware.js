const sessionManager = require('../db/sessionManager');
const { COOKIES } = require('./enum');
const config = require('../config')

const getCalleeURL = (req, isApi) => {
   if (isApi) {
      return `?redirect=${req.referer || '/'}`;
   } else {
      return req.originalUrl !== '/' ? `?redirect=${req.originalUrl || '/'}` : '';
   }
}

module.exports = {
   checkSession: async (req, res, next) => {
      if(config.useLogin){
         let sessionInfo = await sessionManager.isValid(req);
         if (sessionInfo) {
            req.sessionInfo = sessionInfo
            next();
         } else {
            delete req.sessionInfo;
            res.clearCookie(COOKIES.SESSION_ID);
            if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
               let redirectUrl = getCalleeURL(req, true);
               res.status(401).json({ errorMsg: '세션이 유효하지 않습니다', redirect: `/auth/login/${redirectUrl}` })
            } else {
               let redirectUrl = getCalleeURL(req, false);
               res.redirect(`/auth/login${redirectUrl}`);
            }
         }
      }
      else{
         next();
      }
   },

   redirectLogin: (req, res, next) => {
      if (req.originalUrl === '/login.html') {
         res.redirect('/auth/login');
      } else {
         next();
      }
   },

   precompose: (req, res, next) => {
      /* Api 세션 종료 시 Redirect를 위한 URL 편집 */
      req.referer = req.headers.referer ? req.headers.referer.replace(/https?:\/\/(.*?)\//i, '/') : '/';
      next();
   }


}
