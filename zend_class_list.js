jQuery('div.package-indent h1 a').each(function(i) {
 // if (i < 1000) {
    WeBuilderData.SendSafe('Framework Scraper Load Url', "zend_class.js:" + this.href.trim()); 
 // }
});