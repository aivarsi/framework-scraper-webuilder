jQuery('h3:contains("Classes")').next('ul').find('li a').each(function(i) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', "cakephp_class.js:" + this.href.trim()); 
});

jQuery('h3:contains("Functions")').next('ul').find('li a').each(function(i) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', "cakephp_func.js:" + this.href.trim()); 
});
