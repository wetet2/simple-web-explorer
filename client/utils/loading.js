// Loading Element 생성
(() => {
      let loadingInner = document.createElement('div');
      loadingInner.classList.add('hy-loading-inner');
      let loading = document.createElement('div');
      loading.classList.add('hy-loading');
      loading.appendChild(loadingInner);
      document.body.appendChild(loading);
})();

const showLoading = () => {
   document.querySelector('.hy-loading').classList.add('active');
   setTimeout(() => {
      document.querySelector('.hy-loading').classList.add('opening');
   })

}
const hideLoading = () => {
   document.querySelector('.hy-loading').classList.remove('opening');
   setTimeout(() => {
      document.querySelector('.hy-loading').classList.remove('active');
   }, 300)
}

export {
   showLoading, hideLoading
}



