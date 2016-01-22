var func = jQuery('article h1 a').text();
var desc = jQuery('article section.summary p').text();
var ret = jQuery('article section.return p span.return-type').text();
retbrackets = ret.match(/^\((.*)\)$/);
if (retbrackets && retbrackets.length > 1)
  ret = retbrackets[1];

var fnNameRegex = /^(.*?) /;
var fnArgsRegex = /\(.*\)/;
var funcparts = func.match(fnNameRegex);
var funcargs = func.match(fnArgsRegex);

WeBuilderAddFunction(funcparts[1], funcargs[0], ret, desc);

