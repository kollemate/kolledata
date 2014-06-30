jQuery.fn.elasticArea = function() {
  return this.each(function(){
    function resizeTextarea() {
      this.style.height = this.scrollHeight/2 + 'px';
      this.style.height = this.scrollHeight + 'px';
    }
    $(this).keypress(resizeTextarea)
    .keydown(resizeTextarea)
    .keyup(resizeTextarea)
    .css('overflow','hidden');
    resizeTextarea.call(this);
  });
};
