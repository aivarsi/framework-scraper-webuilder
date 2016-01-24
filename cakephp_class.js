var cl = jQuery('title').text();
var clparts = cl.match(/Class ([^\s]+)/);
cl = clparts[1];
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

WeBuilderAddClass(cl, desc, inheritance, "", false);

jQuery('div.method-detail').each(function(i) {
  var scope = jQuery(this).find('h3.method-name span.label').text().trim();
  if (scope.indexOf("public") > -1 || scope == "") {
    var desc = jQuery(this).find('div.description p').text().normalize_spaces();
    var funcname = jQuery(this).find('h3.method-name a').first().text().trim();
    var func = jQuery(this).find('p.method-signature').text().normalize_spaces();
    
    var fnArgsRegex = /\(.*\)/;
    var funcargs = func.match(fnArgsRegex);

    
    var href = jQuery(this).find('td a').attr('href');
    
    var funcres = jQuery(this).find('h6:contains("Returns")').nextAll('div.list').find('code').first().text().normalize_spaces();
    
    var is_static = "0";
    if (scope.indexOf("static") > -1) {
      is_static = "1";
    }

    WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
  }
});


jQuery('div.property-detail').each(function(i) {
  var scope = jQuery(this).find('p.attributes').text().trim();
  if (scope.indexOf("public") > -1 || scope == "") {
    var desc = jQuery(this).find('div.description p').text().normalize_spaces();
    var fieldname = jQuery(this).find('div.property-name a var').text().trim();
    
    var td = jQuery(this).find('p.attributes').clone();
    td.find("*").not(td.find("code, code a")).remove();
    var fieldtype = td.text().normalize_spaces().trim();
    
    var is_static = "0";
    if (scope.indexOf("static") > -1) {
      is_static = "1";
    }

    WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
  }
});