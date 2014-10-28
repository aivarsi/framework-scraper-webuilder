jquery_script.onload = function() {


  //this might contain links to classes
  jQuery("ul.chunklist_reference li a:not(.external)").each(function() {
    WeBuilderExtract("php_func_method.js", this.href);
  });


  jQuery("div.classsynopsis").remove();
  
  jQuery(".methodparam .initializer:contains(\")").remove();

  //process class
  
  //find no more than one class method
  var matches = jQuery("div.description div.methodsynopsis:contains(::), div.description div.constructorsynopsis:contains(::)").last();
  //and no more than one function
  matches = matches.add(jQuery("div.description div.methodsynopsis:not(:contains(::)), div.description div.constructorsynopsis:not(:contains(::))").last());
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