var cl = jQuery('div#elements li.active').text();
var desc = jQuery('div#content div.description p').first().text();
var inheritance = "";
var inh = {};

jQuery('div #content div.section h2:contains("Methods inherited from ") a, div #content div.section h2:contains("Properties inherited from ") a').each(function(i) {
  var parentclass = jQuery(this).text();
  var list = jQuery(this).parent().next().find('code').text().remove_spaces();
  if (list) {
    if (typeof inh[parentclass] == 'undefined') {
      inh[parentclass] = parentclass + "::";
    } else {
      inh[parentclass] += ",";
    }
    inh[parentclass] += list;
  }
});

for (var key in inh) {
  if (inheritance) {
    inheritance += ";";
  }
  inheritance += inh[key];
}

WeBuilderAddClass(cl, desc, inheritance);

jQuery('table#methods tr').each(function(i) {
  var scope = jQuery(this).find('td.name span.label').text().trim();
  if (scope.indexOf("public") > -1 || scope == "") {
    var desc = jQuery(this).find('td p').text().normalize_spaces();
    var funcname = jQuery(this).find('td a').first().text().trim();

    var td = jQuery(this).find('td:not([class])').clone();
    td.find('p').remove();
    var func = td.text().normalize_spaces();
    
    var fnArgsRegex = /\(.*\)/;
    var funcargs = func.match(fnArgsRegex);

    
    var href = jQuery(this).find('td a').attr('href');
    
    var funcres = jQuery("a" + href).nextAll('div.description').find('h6:contains("Returns")').nextAll('div.list').find('code').first().text().normalize_spaces();
    
    var is_static = "0";
    if (scope.indexOf("static") > -1) {
      is_static = "1";
    }

    WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
  }
});


jQuery('table#properties tr').each(function(i) {
  var scope = jQuery(this).find('td.attributes').text().trim();
  if (scope.indexOf("public") > -1 || scope == "") {
    var desc = jQuery(this).find('td.name div.description p').text().normalize_spaces();
    var fieldname = jQuery(this).find('td.name a var').text().trim();
    
    var td = jQuery(this).find('td.attributes').clone();
    td.find("*").remove();
    var fieldtype = td.text().normalize_spaces().trim();
    
    var is_static = "0";
    if (scope.indexOf("static") > -1) {
      is_static = "1";
    }

    WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
  }
});