var cl = jQuery('ul.breadcrumb li.active a').text();
var desc = jQuery('div.element.class p.short_description').text();

WeBuilderData.SendSafe('Framework Scraper Add Class', "<|||>" + cl + "<|||><|||>" + desc + "<|||><|||>" + "" + "<|||>");

jQuery('div.element.method').each(function(i) {
  var desc = jQuery(this).find('h2').text();
  var funcdef = jQuery(this).find('pre').text();
  
  var fnNameRegex = /^[^\(]*/;
  var fnArgsRegex = /\(.*\)/;
  var fnResRegex = /[^\s\\]*$/;
  
  var funcname = funcdef.match(fnNameRegex);
  var funcargs = funcdef.match(fnArgsRegex);
  var funcres = funcdef.match(fnResRegex);
  
  WeBuilderData.SendSafe('Framework Scraper Add Method', "<|||>" + cl + "<|||><|||>" + funcname[0] + "<|||><|||>" + funcargs[0] + "<|||><|||>" + funcres[0] + "<|||><|||>" + desc + "<|||><|||>" + "0" + "<|||>");
});