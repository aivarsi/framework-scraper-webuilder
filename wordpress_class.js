jQuery('section.class-methods ul li a').each(function(i) {
  WeBuilderExtract("wordpress_class_method.js", this.href.trim());
});

var cl = jQuery('article h1 a').text();
var desc = jQuery('article section.summary p').text();

var fnNameRegex = /^(.*?) /;
var clparts = cl.match(fnNameRegex);

var t = jQuery('div.source-code-container .code').text();

var classdefreg = new RegExp("class\\s+" + clparts[1] + "\\sextends\\s([a-zA-Z0-9_]+)", "");
var classdefparts = t.match(classdefreg);
var classextends = "";
if (classdefparts && classdefparts.length > 1)
  classextends = classdefparts[1];

WeBuilderAddClass(clparts[1], desc, "", classextends, false);
