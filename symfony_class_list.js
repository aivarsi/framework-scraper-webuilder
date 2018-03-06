jQuery('div#content div#page-content div.row a:has(abbr)').each(function(i) {
  WeBuilderExtract("laravel_class.js", this.href);
});
