jQuery('article h1 a').each(function(i) {
  WeBuilderExtract("wordpress_class.js", this.href.trim());
});

jQuery('nav a.next.page-numbers').first().each(function(i) {
  WeBuilderExtract("wordpress_class_list.js", this.href.trim());
});