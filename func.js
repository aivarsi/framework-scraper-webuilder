var jquery_script;
if(!(window.jQuery)) {
  jquery_script = document.createElement('script');
  jquery_script.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js');
  jquery_script.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(jquery_script);
}


String.prototype.normalize_spaces = function() {
  return this.replace(/\s+/g, ' ');
};

String.prototype.remove_spaces = function() {
  return this.replace(/\s+/g, '');
};

String.prototype.startsWith = function(prefix) {
    return this.slice(0, prefix.length) == prefix;
}

function _NormalizeType(restype) {
  return restype.normalize_spaces().split("|").join("/");
}

function WeBuilderExtract(scriptname, url) {
  WeBuilderData.Send('Framework Scraper Load Url', scriptname + ":" + url.trim());
}

function WeBuilderAddClass(cl, desc, inherits, classextends, is_static) {
  if (is_static === true) {
    is_static = "1";
  } else if (is_static === false) {
    is_static = "0";
  }
  WeBuilderData.Send('Framework Scraper Add Class', "<|||>" + cl + "<|||><|||>" + desc + "<|||><|||>" + inherits + "<|||><|||>" + classextends + "<|||><|||>" + is_static + "<|||>");
}

function WeBuilderAddTrait(cl, desc, inherits, classextends) {
  WeBuilderData.Send('Framework Scraper Add Trait', "<|||>" + cl + "<|||><|||>" + desc + "<|||><|||>" + inherits + "<|||><|||>" + classextends + "<|||><|||>" + "0" + "<|||>");
}

function WeBuilderAddMethod(cl, funcname, funcargs, restype, desc, is_static) {
  if (is_static === true) {
    is_static = "1";
  } else if (is_static === false) {
    is_static = "0";
  }
  restype = _NormalizeType(restype);
  WeBuilderData.Send('Framework Scraper Add Method', "<|||>" + cl + "<|||><|||>" + funcname + "<|||><|||>" + funcargs + "<|||><|||>" + restype + "<|||><|||>" + desc + "<|||><|||>" + is_static + "<|||>");
}

function WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static) {
  if (is_static === true) {
    is_static = "1";
  } else if (is_static === false) {
    is_static = "0";
  }
  fieldtype = _NormalizeType(fieldtype);
  WeBuilderData.Send('Framework Scraper Add Field', "<|||>" + cl + "<|||><|||>" + fieldname + "<|||><|||>" + fieldtype + "<|||><|||>" + desc + "<|||><|||>" + is_static + "<|||>");
}

function WeBuilderAddFunction(funcname, funcargs, restype, desc) {
  restype = _NormalizeType(restype);
  WeBuilderData.Send('Framework Scraper Add Func', "<|||>" + funcname + "<|||><|||>" + funcargs + "<|||><|||>" + restype + "<|||><|||>" + desc + "<|||>");
}

function WeBuilderAddPHPBuiltInMethod(cl, funcname, funcsignature) {
  WeBuilderData.Send('Framework Scraper Add PHP Built In Method', "<|||>" + cl + "<|||><|||>" + funcname + "<|||><|||>" + funcsignature + "<|||>");
}


function WeBuilderAddPHPBuiltInFunction(funcname, funcargs, restype, desc) {
  restype = _NormalizeType(restype);
  WeBuilderData.Send('Framework Scraper Add PHP Built In Func', "<|||>" + funcname + "<|||><|||>" + funcargs + "<|||><|||>" + restype + "<|||><|||>" + desc + "<|||>");
}

