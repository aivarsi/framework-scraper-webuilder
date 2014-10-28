jquery_script.onload = function() {

  jQuery("li a:not(.external)").each(function() {
    WeBuilderExtract("php_func_method.js", this.href);
  });

}