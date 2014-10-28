var func = jQuery('article h1 a').text();
var desc = jQuery('article section.description p').text();
var ret = jQuery('article section.return p span.return-type').text();

var fnNameRegex = /^(.*?)::(.*?) /;
var fnArgsRegex = /\(.*\)/;
var funcparts = func.match(fnNameRegex);
var funcargs = func.match(fnArgsRegex);

WeBuilderAddMethod(funcparts[1], funcparts[2], funcargs[0], ret, desc, "0");

