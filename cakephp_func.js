var func = jQuery('div#elements li.active').text();
var desc = jQuery('div#content div.description p').text();
var ret = jQuery('div#content div.section:contains("Return value summary") span.name').first().text().trim();

var args = "";

jQuery('div#content div.section:contains("Parameters summary") table.summary tr').each(function() {
  var arg = "";
  jQuery(this).find('code').each(function() {
    if (arg)
      arg += " ";
     arg += jQuery(this).text();
  });
  if (args)
    args += ", ";
  args += arg;
});

args = "(" + args + ")";

WeBuilderAddFunction(func, args, ret, desc);

