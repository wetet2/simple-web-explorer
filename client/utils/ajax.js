import axios from 'axios';

import { showLoading, hideLoading } from '../reducer/loadReducer'
import store from '../store';

let runningCount = 0;

const axiosOptions = {
   timeout: 1200000,
   validateStatus: (status) => {
      return (status >= 200 && status < 300) || status === 401
   },
};

const ajax = (url, data, callback, errorCallback, loading, options) => {

   if (loading) {
      runningCount++;
      store.dispatch(showLoading())
   };
   let method = 'post';
   if (options && options.method) method = options.method.toLowerCase();
   const _promise = axios[method](url, data, { ...axiosOptions, ...(options || {}) })
   _promise
      .then((res) => {
         try {
            if (res.status !== 200) {
               if (res.data && res.data.errorMsg) {
                  alert(`${res.data.errorMsg}${res.data.errorDetail ? `\n${res.data.errorDetail}` : ''}`)
               }
               if (res.data && res.data.redirect) window.location.href = res.data.redirect;
            } else {
               if (res.data && res.data.errorMsg) {
                  alert(`${res.data.errorMsg}${res.data.errorDetail ? `\n${res.data.errorDetail}` : ''}`)
               }
               else {
                  if (res.data && res.data.alertMsg) alert(res.data.alertMsg);
                  if (callback) callback(res);
               }
               if (res.data && res.data.redirect) window.location.href = res.data.redirect;
            }
         } catch (err) {
            console.log(err);
         } finally {
            if (loading) {
               runningCount--;
               if(runningCount === 0) store.dispatch(hideLoading());
            };
         }
      })
      .catch((err) => {
         console.log(err);
         if (errorCallback) errorCallback(err);
         if (loading) {
            runningCount--;
            if(runningCount === 0) store.dispatch(hideLoading());
         };
      })
   return _promise;
};
export default ajax;