jQuery('h3:contains("Classes")').next('ul').find('li a').each(function(i) {
  WeBuilderExtract("cakephp_class.js", this.href.trim());
});

jQuery('h3:contains("Functions")').next('ul').find('li a').each(function(i) {
  WeBuilderExtract("cakephp_func.js", this.href.trim());
});
