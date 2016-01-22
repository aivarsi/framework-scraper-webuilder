var cl = jQuery('title').text();
clparts = cl.match(/[^\s]*$/);
cl = clparts[0];
if (cl.startsWith('\\')) {
  cl = cl.substring(1);
}
var clextends = jQuery('table th:contains("inherited_from")').next('td:first').text();
if (clextends.startsWith('\\')) {
  clextends = clextends.substring(1);
}
  
var desc = jQuery('div.element.class p.short_description').text();

WeBuilderAddClass(cl, desc, "", clextends, false);

jQuery('div.element.method').each(function(i) {
  var desc = jQuery(this).find('h2').text();
  var funcdef = jQuery(this).find('pre').text();
  
  var is_static = false;
  jQuery(this).find('span.label:contains("Static")').each(function() {
    is_static = true;
  });
  
  var fnNameRegex = /^[^\(]*/;
  var fnArgsRegex = /\(.*\)/;
  var fnResRegex = /[^\s]*$/;
  
  var funcname = funcdef.match(fnNameRegex);
  var funcargs = funcdef.match(fnArgsRegex);
  var funcres = funcdef.match(fnResRegex);
  
  if (funcres[0].startsWith('\\')) {
    funcres[0] = funcres[0].substring(1);
  }

  WeBuilderAddMethod(cl, funcname[0], funcargs[0], funcres[0], desc, is_static);
});