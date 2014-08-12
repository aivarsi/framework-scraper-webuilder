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

function _NormalizeType(restype) {
  return restype.normalize_spaces().split("|").join("/");
}

function WeBuilderExtract(scriptname, url) {
  WeBuilderData.SendSafe('Framework Scraper Load Url', scriptname + ":" + url.trim());
}

function WeBuilderAddClass(cl, desc, inherits) {
  WeBuilderData.SendSafe('Framework Scraper Add Class', "<|||>" + cl + "<|||><|||>" + desc + "<|||><|||>" + inherits + "<|||>");
}

function WeBuilderAddMethod(cl, funcname, funcargs, restype, desc, is_static) {
  if (is_static === true) {
    is_static = "1";
  } else if (is_static === false) {
    is_static = "0";
  }
  restype = _NormalizeType(restype);
  WeBuilderData.SendSafe('Framework Scraper Add Method', "<|||>" + cl + "<|||><|||>" + funcname + "<|||><|||>" + funcargs + "<|||><|||>" + restype + "<|||><|||>" + desc + "<|||><|||>" + is_static + "<|||>");
}

function WeBuilderAddProperty(cl, fieldname, fieldtype, desc, is_static) {
  if (is_static === true) {
    is_static = "1";
  } else if (is_static === false) {
    is_static = "0";
  }
  fieldtype = _NormalizeType(fieldtype);
  WeBuilderData.SendSafe('Framework Scraper Add Field', "<|||>" + cl + "<|||><|||>" + fieldname + "<|||><|||>" + fieldtype + "<|||><|||>" + desc + "<|||><|||>" + is_static + "<|||>");
}

function WeBuilderAddFunction(funcname, funcargs, restype, desc) {
  restype = _NormalizeType(restype);
  WeBuilderData.SendSafe('Framework Scraper Add Func', "<|||>" + funcname + "<|||><|||>" + funcargs + "<|||><|||>" + restype + "<|||><|||>" + desc + "<|||>");
}