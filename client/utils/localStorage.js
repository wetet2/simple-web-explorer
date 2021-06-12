export default {
   get: (key) => {
      const result = localStorage.getItem(key);
      if (result && result !== 'undefined') {
         return JSON.parse(result);
      } else {
         return result;
      }
   },
   set: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
   }
}