
function Toast(message){
   this.element = document.createElement('div');
   this.element.classList.add('toast');
   this.element.innerText = message;
}
Toast.prototype.show = function(){
   setTimeout(() => {
      this.element.classList.add('active');
   })
};
Toast.prototype.hide = function(){
   setTimeout(() => {
      this.element.classList.add('shrink');
   })
   setTimeout(() => {
      this.element.remove();
   }, 300);
};
Toast.prototype.appendTo = function(wrapElement){
   wrapElement.append(this.element);
};
Toast.prototype.setBottom = function(bottom){
   this.element.style.bottom = (bottom.constructor.name === 'Number' ? bottom + 'px' : bottom);
};

export default Toast;