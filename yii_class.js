var cl = jQuery('table.summaryTable tr').has('th:contains("Inheritance")').find('td a:first').text().trim();

if (cl != "") {
  var clextends = jQuery('table.summaryTable tr').has('th:contains("Inheritance")').find('td a:nth-child(2)').text();
  var desc = jQuery('div.class-description p strong').first().text();


  var is_static = false;
  if (jQuery('div.detail-header span.detail-header-tag.small:contains("static")').length) {
    is_static = true;
  }

  WeBuilderAddClass(cl, desc, "", clextends, is_static);

  jQuery('div.method-doc div.detail-header').each(function(i) {
    var scope = jQuery(this).find('span.detail-header-tag').text().trim();
    if (scope.indexOf("public") > -1 || scope == "") {
      var desc = jQuery(this).next('div.doc-description').find('p').first().text().normalize_spaces();
      
      var funcname = jQuery(this).clone();
      funcname.find('*').remove();
      funcname = funcname.text().trim();
      funcname = funcname.replace(/\(\)/, "");
      
      var func = jQuery(this).nextAll('table.detail-table').first().find('td.signature').text().normalize_spaces();
      
      var fnArgsRegex = /\(.*\)/;
      var funcargs = func.match(fnArgsRegex);

      var funcres = jQuery(this).nextAll('table.detail-table').first().find('th:contains("return")').next('td.param-type-col').first().text().normalize_spaces();
      
      var is_static = "0";
      if (scope.indexOf("static") > -1) {
        is_static = "1";
      }

      WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
    }
  });


  jQuery('div.property-doc div.detail-header').each(function(i) {
    var scope = jQuery(this).find('span.detail-header-tag').text().trim();
    if (scope.indexOf("public") > -1 || scope == "") {
      var desc = jQuery(this).next('div.doc-description').find('p').first().text().normalize_spaces();
      var fieldname = jQuery(this).clone();
      fieldname.find('*').remove();
      fieldname = fieldname.text().trim();
      
      var fieldtype = jQuery(this).nextAll('div.signature').first().find('span.signature-type').text().normalize_spaces();
      
      var is_static = "0";
      if (scope.indexOf("static") > -1) {
        is_static = "1";
      }

      WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
    }
  });
}