var cl = jQuery('title').text().match(/^[^ ]+/);
var desc = "";
var inheritance = "";
var classextends = "";
var inh = {};
var is_trait = false;

var Facades = {
'Illuminate\\Foundation\\Application': 'App',
'Illuminate\\Contracts\\Console\\Kernel': 'Artisan',
'Illuminate\\Auth\\Guard': 'Auth',
'Illuminate\\View\\Compilers\\BladeCompiler': 'Blade',
'Illuminate\\Contracts\\Bus\\Dispatcher': 'Bus',
'Illuminate\\Cache\\Repository': 'Cache',
'Illuminate\\Config\\Repository': 'Config',
'Illuminate\\Cookie\\CookieJar': 'Cookie',
'Illuminate\\Encryption\\Encrypter': 'Crypt',
'Illuminate\\Database\\Connection': 'DB',
'Illuminate\\Events\\Dispatcher': 'Event',
'Illuminate\\Filesystem\\Filesystem': 'File',
'Illuminate\\Contracts\\Auth\\Access\\Gate': 'Gate',
'Illuminate\\Contracts\\Hashing\\Hasher': 'Hash',
'Illuminate\\Http\\Request': 'Input',
'Illuminate\\Translation\\Translator': 'Lang',
'Illuminate\\Log\\Writer': 'Log',
'Illuminate\\Mail\\Mailer': 'Mail',
'Illuminate\\Auth\\Passwords\\PasswordBroker': 'Password',
'Illuminate\\Queue\\QueueInterface': 'Queue',
'Illuminate\\Routing\\Redirector': 'Redirect',
'Illuminate\\Redis\\Database': 'Redis',
'Illuminate\\Http\\Request': 'Request',
'Illuminate\\Contracts\\Routing\\ResponseFactory': 'Response',
'Illuminate\\Routing\\Router': 'Route',
'Illuminate\\Database\\Schema\\Blueprint': 'Schema',
'Illuminate\\Session\\Store': 'Session',
'Illuminate\\Contracts\\Filesystem\\Factory': 'Storage',
'Illuminate\\Routing\\UrlGenerator': 'URL',
'Illuminate\\Validation\\Validator': 'Validator',
'Illuminate\\View\\View': 'View'
};

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
  
  if (cl in Facades) {
    WeBuilderAddClass(Facades[cl], desc, inheritance, classextends, true); //this class has a facade, add it
  }
  
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
    
    if (cl in Facades) {
      WeBuilderAddMethod(Facades[cl], funcname, funcargs[0], funcres, desc, true);
    }
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

