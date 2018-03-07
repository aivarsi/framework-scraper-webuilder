var cl = jQuery('dd.hierarchy div.namespace-wrapper').last().text().trim().replace(/^\\/, '');
var desc = jQuery('h1:first').next('p').first().text();
var inheritance = "";
var inh = {};
var is_static = false;

jQuery('article.property:has(h3.public),article.method:has(h3.public)').each(function(i) {
  var parentclass = jQuery(this).parent().next('aside').find('dl > dd div.path-wrapper').text().trim().replace(/^\\/, '');
  var member = jQuery(this).find('> h3.public').text().remove_spaces();
  if (parentclass && member) {
    if (typeof inh[parentclass] == 'undefined') {
      inh[parentclass] = parentclass + "::";
    } else {
      inh[parentclass] += ",";
    }
    inh[parentclass] += member;    
  }
  if (member) {
    if(jQuery(this).parent().next('aside').find('span.label-info:contains("static")').length) {
      is_static = true;
    }
  }
});

for (var key in inh) {
  if (inheritance) {
    inheritance += ";";
  }
  inheritance += inh[key];
}

if (cl !== '') {

  WeBuilderAddClass(cl, desc, inheritance, "", is_static);

  jQuery('article.method:has(h3.public)').each(function(i) {
    
      var desc = jQuery(this).find('p').first().text().normalize_spaces();
      var funcname = jQuery(this).find('h3').first().text().trim();
      funcname = funcname.replace(/[\(\)]+$/, '');
      var func = jQuery(this).find('pre.signature').text().normalize_spaces();
      
      var fnArgsRegex = /\(.*\)/;
      var funcargs = func.match(fnArgsRegex);

      
      var href = jQuery(this).find('td a').attr('href');
      
      var funcres = "";
      if (jQuery(this).find('h4:contains("Returns")').length) {
        if (jQuery(this).find('h4:contains("Returns")').next('a').length) {
          funcres = jQuery(this).find('h4:contains("Returns")').next('a').text().replace(/[—]/g, '').trim().normalize_spaces().replace(/^\\/, '');
        } else {
          funcres = jQuery(this).find('h4:contains("Returns")').get(0).nextSibling.nodeValue.replace(/[—]/g, '').trim().normalize_spaces().replace(/^\\/, '');
        }
        if (funcres == 'self') {
          funcres = cl;
        }
      }
      
      var is_static = "0";
      if(jQuery(this).parent().next('aside').find('span.label-info:contains("static")').length) {
        is_static = "1";
      }

      WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
    
  });


  jQuery('article.property:has(h3.public)').each(function(i) {
    
      var desc = jQuery(this).find('p').first().text().normalize_spaces();
      var fieldname = jQuery(this).find('h3').text().trim();
      
      var fieldtype = "";
      if (jQuery(this).find('h4:contains("Type")').length) {
        if (jQuery(this).find('h4:contains("Type")').next('a').length) {
          fieldtype = jQuery(this).find('h4:contains("Type")').next('a').text().replace(/[—]/g, '').trim().normalize_spaces().replace(/^\\/, '');
        } else {
          fieldtype = jQuery(this).find('h4:contains("Type")').get(0).nextSibling.nodeValue.replace(/[—]/g, '').trim().normalize_spaces().replace(/^\\/, '');
        }
      }
      
      var is_static = "0";
      if(jQuery(this).parent().next('aside').find('span.label-info:contains("static")').length) {
        is_static = "1";
      }

      WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
    
  });
  
}
