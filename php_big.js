jquery_script.onload = function() {

  jQuery("li.listitem a").each(function() {
    WeBuilderExtract("php_funclist.js", this.href);
  });
  
}