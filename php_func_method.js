jquery_script.onload = function() {


  //this might contain links to classes
  jQuery("ul.chunklist_reference li a:not(.external)").each(function() {
    WeBuilderExtract("php_func_method.js", this.href);
  });


  jQuery("div.classsynopsis").remove();
  
  jQuery(".methodparam .initializer:contains(\")").remove();

  //process class
  
  //find no more than one class method with most commas (most parameters)
  var matches = jQuery();
  var maxcommacount = -1;
  var bestmatch = null;
  jQuery("div.description div.methodsynopsis:contains(::), div.description div.constructorsynopsis:contains(::)").each(function() {
    var funccall = $(this).text().trim().normalize_spaces();
    var commacount = funccall.split(",").length - 1;
    if (commacount > maxcommacount) {
      bestmatch = this;
      maxcommacount = commacount;
    }
  });
  if (bestmatch) {
    matches = matches.add(bestmatch);    
  }
  //and no more than one function with most commas
  maxcommacount = -1;
  bestmatch = null;
  jQuery("div.description div.methodsynopsis:not(:contains(::)), div.description div.constructorsynopsis:not(:contains(::))").each(function() {
    var funccall = $(this).text().trim().normalize_spaces();
    var commacount = funccall.split(",").length - 1;
    if (commacount > maxcommacount) {
      bestmatch = this;
      maxcommacount = commacount;
    }
  });
  if (bestmatch) {    
    matches = matches.add(bestmatch);
  }
  

  matches.each(function() {
    var synopsis = $(this);
    var funccall = synopsis.text().trim().normalize_spaces();
    var funcname = synopsis.find("span.methodname").text().remove_spaces();
    var funcdesc = jQuery("p.refpurpose span.dc-title").text().trim().normalize_spaces();
    var restype =  synopsis.find("span.methodname").prev("span.type").text().remove_spaces();
    var className;
    
    var argsRegex = /\(.*\)/;
    var funcargs = funccall.match(argsRegex);

    var methodRegex = /^(.*)?\:\:(.*)$/;
    var methodCall = funcname.match(methodRegex);
    if (methodCall) {
      className = methodCall[1];
      funcname = methodCall[2];
      funccall = funccall.replace(methodCall[0], funcname);
    } else {
      className = '';
    }

    if (className != "") {
      WeBuilderAddPHPBuiltInMethod(className, funcname, funccall + " - " + funcdesc);
    } else {    
      WeBuilderAddPHPBuiltInFunction(funcname, funcargs, restype, funcdesc)
    }
  });

}