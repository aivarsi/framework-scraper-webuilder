jquery_script.onload = function() {

  var cl = jQuery('div.content p:first strong').text();
  var desc = "";
  var inheritance = "";
  var inh = {};

  jQuery('h2:contains("Methods")').next('table').find('tr td small a abbr').each(function(i) {
    var parentclass = jQuery(this).text();
    var funcname = jQuery(this).parent().parent().parent().parent().find('td.last a:first').text();

    if (typeof inh[parentclass] == 'undefined') {
      inh[parentclass] = parentclass + "::";
    } else {
      inh[parentclass] += ",";
    }
    inh[parentclass] += funcname + "()";
  });

  for (var key in inh) {
    if (inheritance) {
      inheritance += ";";
    }
    inheritance += inh[key];
  }

  WeBuilderAddClass(cl, desc, inheritance);


  jQuery('h2:contains("Methods")').next('table').find('tr').each(function(i) {
    
    var isInherited = (jQuery(this).find('td small a abbr').length > 0);
    
    if (!isInherited) {
    
      var desc = jQuery(this).find('td.last p').text().normalize_spaces();
      var funcname = jQuery(this).find('td.last a:first').first().text().trim();

      var td = jQuery(this).find('td.last').clone();
      td.find('p').remove();
      var func = td.text().normalize_spaces();
      
      var fnArgsRegex = /\(.*\)/;
      var funcargs = func.match(fnArgsRegex);

      
      var funcres = jQuery(this).find('td.type').text().trim();
      
      var is_static = "0";
  
      WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
    }
  });
  
  
  jQuery('h2:contains("Properties")').next('table').find('tr').each(function(i) {
    
    
    var desc = jQuery(this).find('td.last').text().normalize_spaces();
    var fieldname = jQuery(this).find('td.last').prev().text().trim();
    var fieldtype = jQuery(this).find('td.type').text().trim();

    WeBuilderAddProperty(cl, fieldname, fieldtype, desc, "0");
  });


}
