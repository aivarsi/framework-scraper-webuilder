var cl = jQuery('title').text().match(/^[^ ]+/);
var desc = "";
var inheritance = "";
var classextends = "";
var inh = {};
var is_trait = false;

jQuery('h2:contains("Methods")').next('div').find('div.row div small a abbr').each(function(i) {
  var parentclass = jQuery(this).text();
  var funcname = jQuery(this).parent().parent().parent().parent().find('div.col-md-8.type a:first').text();

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

jQuery('div.page-header').next('p').find('strong').each(function(i) {
  var c = "";
  try {
    c = this.previousSibling.nodeValue.trim();
  } catch(e) {}
  if(c == 'trait') {
    is_trait = true;
  }
});

jQuery('div.page-header').next('p').find('a abbr').each(function(i) {
  var c = "";
  try {
    c = this.parentNode.previousSibling.nodeValue.trim();
  } catch(e) {}
  if(c == 'extends') {
    classextends = jQuery(this).attr('title');
  }
});

jQuery('h2:contains("Traits")').next('div').find('div.row a abbr').each(function(i) {
  var c = jQuery(this).attr('title');
  classextends = classextends + "," + c;
});

if (!is_trait) {
  WeBuilderAddClass(cl, desc, inheritance, classextends, false);
    
} else {
  WeBuilderAddTrait(cl, desc, inheritance, classextends);
}


jQuery('h2:contains("Methods")').next('div').find('div.row').each(function(i) {
  
  var isInherited = (jQuery(this).find('div small a abbr').length > 0);
  
  if (!isInherited) {
  
    var desc = jQuery(this).find('div.col-md-8.type p').text().normalize_spaces();
    var funcname = jQuery(this).find('div.col-md-8.type a:first').first().text().trim();

    var td = jQuery(this).find('div.col-md-8.type').clone();
    td.find('p').remove();
    var func = td.text().normalize_spaces();
    
    var fnArgsRegex = /\(.*\)/;
    var funcargs = func.match(fnArgsRegex);

    
    var ret_td = jQuery(this).find('div.col-md-2.type').clone();
    ret_td.find('a abbr').each(function(i) {
      jQuery(this).html(jQuery(this).attr('title'));
    });
    var funcres = ret_td.text().trim();
    
    var is_static = funcres.startsWith('static');
    if (is_static) {
      is_static = "1";
    }
    funcres = funcres.replace(/^static\b/, '').trim();

    WeBuilderAddMethod(cl, funcname, funcargs[0], funcres, desc, is_static);
    
  }
});


jQuery('h2:contains("Properties")').next('table').find('tr').each(function(i) {
  
  
  var desc = jQuery(this).find('td.last').text().normalize_spaces();
  var fieldname = jQuery(this).find('td.last').prev().text().trim();
  var fieldtype = jQuery(this).find('td.type').text().trim();
  
  var is_static = fieldtype.startsWith('static ');
  if (is_static) {
    is_static = "1";
  }
  fieldtype = fieldtype.replace(/^static /, '');

  WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
});

