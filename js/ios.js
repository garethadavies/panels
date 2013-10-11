$(function() {

	document.addEventListener('touchmove', function(e) {

    e.preventDefault(); 

  }, false);

  preventOverScroll(document.getElementById('page-wrapper'));

  preventOverScroll(document.getElementById('panel-top'));

  preventOverScroll(document.getElementById('panel-right'));

  preventOverScroll(document.getElementById('panel-bottom'));

  preventOverScroll(document.getElementById('panel-left'));

});