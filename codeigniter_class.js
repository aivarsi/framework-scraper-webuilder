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
});

for (var key in inh) {
  if (inheritance) {
    inheritance += ";";
  }
  inheritance += inh[key];
}

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
      funcres = jQuery(this).find('h4:contains("Returns")').get(0).nextSibling.nodeValue.replace(/[—]/g, '').trim().normalize_spaces();
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
      fieldtype = jQuery(this).find('h4:contains("Type")').get(0).nextSibling.nodeValue.replace(/[—]/g, '').trim().normalize_spaces();
    }
    
    var is_static = "0";
    if(jQuery(this).parent().next('aside').find('span.label-info:contains("static")').length) {
      is_static = "1";
    }

    WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static);
  
});

if (cl == 'CI_Controller' || cl == 'CI_Model') {
    WeBuilderAddProperty(cl, '$benchmark', 'CI_Benchmark', 'Benchmarking class', '0');
    WeBuilderAddProperty(cl, '$cache', 'CI_Cache', 'Caching driver', '0');
    WeBuilderAddProperty(cl, '$calendar', 'CI_Calendar', 'Calendar class', '0');
    WeBuilderAddProperty(cl, '$config', 'CI_Config', 'Config class', '0');
    WeBuilderAddProperty(cl, '$email', 'CI_Email', 'Email class', '0');
    WeBuilderAddProperty(cl, '$encryption', 'CI_Encryption', 'Encryption library', '0');
    WeBuilderAddProperty(cl, '$upload', 'CI_Upload', 'File uploading class', '0');
    WeBuilderAddProperty(cl, '$form_validation', 'CI_Form_validation', 'Form validation class', '0');
    WeBuilderAddProperty(cl, '$ftp', 'CI_FTP', 'FTP class', '0');
    WeBuilderAddProperty(cl, '$image_lib', 'CI_Image_lib', 'Image manipulation class', '0');
    WeBuilderAddProperty(cl, '$input', 'CI_Input', 'Input class', '0');
    WeBuilderAddProperty(cl, '$lang', 'CI_Lang', 'Language class', '0');
    WeBuilderAddProperty(cl, '$load', 'CI_Loader', 'Loader class', '0');
    WeBuilderAddProperty(cl, '$migration', 'CI_Migration', 'Migrations class', '0');
    WeBuilderAddProperty(cl, '$output', 'CI_Output', 'Output class', '0');
    WeBuilderAddProperty(cl, '$pagination', 'CI_Pagination', 'Pagination class', '0');
    WeBuilderAddProperty(cl, '$parser', 'CI_Parser', 'Template parser class', '0');
    WeBuilderAddProperty(cl, '$security', 'CI_Security', 'Security class', '0');
    WeBuilderAddProperty(cl, '$session', 'CI_Session', 'Session class', '0');
    WeBuilderAddProperty(cl, '$table', 'CI_Table', 'Table class', '0');
    WeBuilderAddProperty(cl, '$trackback', 'CI_Trackback', 'Trackback class', '0');
    WeBuilderAddProperty(cl, '$typography', 'CI_Typography', 'Typography class', '0');
    WeBuilderAddProperty(cl, '$unit', 'CI_Unit_test', 'Unit testing class', '0');
    WeBuilderAddProperty(cl, '$uri', 'CI_URI', 'URI class', '0');
    WeBuilderAddProperty(cl, '$agent', 'CI_User_agent', 'User agent class', '0');
    WeBuilderAddProperty(cl, '$xmlrpc', 'CI_Xmlrpc', 'XML-RPC class (client)', '0');
    WeBuilderAddProperty(cl, '$xmlrpcs', 'CI_Xmlrpcs', 'XML-RPC class (server)', '0');
    WeBuilderAddProperty(cl, '$zip', 'CI_Zip', 'Zip encoding class', '0');
}