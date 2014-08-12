jquery_script.onload = function() {

  jQuery('div.content table tr td a:has(abbr)').each(function(i) {
    WeBuilderExtract("laravel_class.js", this.href);
  });

}