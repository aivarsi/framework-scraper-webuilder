jQuery('article h1 a').each(function(i) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', "wordpress_class.js:" + this.href.trim()); 
});

jQuery('nav a.next.page-numbers').first().each(function(i) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', "wordpress_class_list.js:" + this.href.trim()); 
});