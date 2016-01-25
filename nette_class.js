var cl = jQuery('dl.tree dd b span').text().trim();

if (cl != "") {
  var clextends = jQuery('dl.tree dd').last().prev('dd').find('a span').first().text();
  var desc = jQuery('div.description p').first().text();


  var is_static = false;
  if (jQuery('#methods tr td.attributes code:contains("static")').length) {
    is_static = true;
  }

  WeBuilderAddClass(cl, desc, "", clextends, is_static);

  jQuery('#methods tr').each(function(i) {
    var scope = jQuery(this).find('td.attributes>code').text().trim();
    if (scope.indexOf("public") > -1 || scope == "") {
      var desc = jQuery(this).find('div.description.short p').first().text().normalize_spaces();
      
      var funcname = jQuery(this).find('td.name div code a').first().text().trim();
      
      var func = jQuery(this).find('td.name div code').first().text().normalize_spaces();
      
      var fnArgsRegex = /\(.*\)/;
      var funcargs = func.match(fnArgsRegex);

      var funcres = "";
      var funcresparts = scope.replace(/public|static/g, "");
      funcresparts = funcresparts.match(/[^\s]+$/);      
      if (funcresparts && funcresparts.length > 0)
        funcres = funcresparts[0];
      
      var is_static = "0";
      if (scope.indexOf("static") > -1) {
        is_static = "1";
      }

      WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
    }
  });


  jQuery('#properties tr').each(function(i) {
    var scope = jQuery(this).find('td.attributes>code').text().trim();
    if (scope.indexOf("public") > -1 || scope == "") {
      var desc = jQuery(this).find('div.description.short p').first().text().normalize_spaces();
      
      var fieldname = jQuery(this).find('td.name a var').first().text().trim();
      
      var fieldtype = "";
      var fieldtypeparts = scope.replace(/public|static/g, "");
      fieldtypeparts = fieldtypeparts.match(/[^\s]+$/);      
      if (fieldtypeparts && fieldtypeparts.length > 0)
        fieldtype = fieldtypeparts[0];
        
      var is_static = "0";
      if (scope.indexOf("static") > -1) {
        is_static = "1";
      }

      WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
    }
  });
}