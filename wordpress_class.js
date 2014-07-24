jQuery('section.class-methods ul li a').each(function(i) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', "wordpress_class_method.js:" + this.href.trim()); 
});

var cl = jQuery('article h1 a').text();
var desc = jQuery('article section.description p').text();

var fnNameRegex = /^(.*?) /;
var clparts = cl.match(fnNameRegex);

WeBuilderData.SendSafe('Framework Scraper Add Class', "<|||>" + clparts[1] + "<|||><|||>" + desc + "<|||>");
