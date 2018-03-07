jquery_script.onload = function() {

  jQuery('body > table > tbody > tr > td > a').each(function(i) {
    if (i > 0) { // 0 = Parent Directory
      WeBuilderExtract("zend_class.js", this.href.trim());
    }
  });
}