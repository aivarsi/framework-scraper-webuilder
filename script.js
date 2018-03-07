var QueueProcessInterval = 300;
var TimeReservedForScriptExecution = 150;

var win = null;
var web = null;
var CallbackAfterLoad = "";
var CallbackOnQueueEmpty = "";
var WebkitLoadingUrl = "";
var ScriptToExecute = "";
var UrlQueue = new TStringList;
var ScriptQueue = new TStringList;
var matches;
var IsLoadingUrl = false;
var LibName = "test";
var TimesQueueEmpty = 0;

var phpobjini;
var phpclasses;
var phpfuncnames;
var phpfunc;
var phpfuncshow;
var UniqueUrls = null;
      

function WebkitLoadUrl(Url, Js) {

  IsLoadingUrl = true;

  //do we need to check if this url has been processed before?
  if (UniqueUrls != null) {
    //new url
    if (UniqueUrls.IndexOf(Url) == -1) {
      UniqueUrls.Add(Url);
    //seen url, exit without loading
    } else {
      IsLoadingUrl = false;
      return false;
    }
  } 

  WebkitLoadingUrl = Url;
  ScriptToExecute = Js;
  web.Webkit.Load(Url);
  
  return true;
}

function OnWebkitCreated(Sender, Browser) {
  Script.TimeOut(QueueProcessInterval, &OnTimerProcessQueue);
}


function CreateWebkit(Callback) {
  var Created = false;

  if (win == null) {
    win = new TForm(WeBuilder);
    win.width = 800;
    win.Height = 600;
    win.Caption = "Browser";
    web = Script.CreateScriptableWebKit(win, "", &OnWebkitCreated);
    web.Subscribe("Framework Scraper Load Url", &OnWebkitData);
    web.Subscribe("Framework Scraper Add Func", &OnWebkitData);
    web.Subscribe("Framework Scraper Add Class", &OnWebkitData);
    web.Subscribe("Framework Scraper Add Trait", &OnWebkitData);
    web.Subscribe("Framework Scraper Add Method", &OnWebkitData);
    web.Subscribe("Framework Scraper Add Field", &OnWebkitData);
    web.Subscribe("Framework Scraper Add PHP Built In Method", &OnWebkitData);
    web.Subscribe("Framework Scraper Add PHP Built In Func", &OnWebkitData);
    web.OnLoadEnd = &OnWebkitLoadEnd;
    web.OnConsoleMessage = &OnWebkitConsoleMessage;
    CallbackAfterLoad = Callback;
    web.Webkit.Top = 0;
    web.Webkit.Left = 0;
    web.Webkit.Width = win.ClientWidth;
    web.Webkit.Height = win.ClientHeight;
    web.Webkit.Anchors = akLeft || akRight || akTop || akBottom;
    Created = true;
  }
  win.Show;
  return Created;
}


function OnWebkitData(channel, data) {
  var f;
  var s = "";
  var classname;
  var funcname;
  var funcargs;
  var rettype;
  var desc;
  var is_static;
  var fieldname;
  var inheritance;
  var scope;
  
  //Script.Message(data + " (" + channel + ")");
    
  if (channel == "Framework Scraper Load Url") {
    var i = Pos(":", data);
    if (i > 0) {
      var js = copy(data, 1, i - 1);
      var url = copy(data, i + 1, Length(data));
      
      UrlQueue.Add(url);
      ScriptQueue.Add(js);

    }
  } else if ((channel == "Framework Scraper Add Class") || (channel == "Framework Scraper Add Trait")) {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      classname     = _v(matches, [0, 1]);
      desc          = _v(matches, [1, 1]);
      inheritance   = _v(matches, [2, 1]);
      classextends  = _v(matches, [3, 1]);
      is_static     = (_v(matches, [4, 1]) == "1");
      if (channel == "Framework Scraper Add Class") {
        scope = pscUnknown;
      } else {
        scope = pscTrait;
      }
      AutoCompleteLibrary.AddPHPEntry(LibName, pitClass, classname, desc, inheritance, scope, is_static, "", "", classextends, "");
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add Func") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      funcname = _v(matches, [0, 1]);
      funcargs = _v(matches, [1, 1]);
      rettype  = _v(matches, [2, 1]);
      desc     = _v(matches, [3, 1]);
      AutoCompleteLibrary.AddPHPEntry(LibName, pitFunction, funcname, desc, "", pscUnknown, False, funcargs, "", "", rettype);
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add Method") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      classname = _v(matches, [0, 1])
      funcname  = _v(matches, [1, 1]);
      funcargs  = _v(matches, [2, 1]);
      rettype   = _v(matches, [3, 1]);
      desc      = _v(matches, [4, 1]);
      is_static = (_v(matches, [5, 1]) == "1");
      AutoCompleteLibrary.AddPHPEntry(LibName, pitFunction, funcname, desc, "", pscUnknown, is_static, funcargs, classname, "", rettype);
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add Field") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      classname = _v(matches, [0, 1])
      fieldname = _v(matches, [1, 1]);
      rettype   = _v(matches, [2, 1]);
      desc      = _v(matches, [3, 1]);
      is_static = (_v(matches, [4, 1]) == "1");
      AutoCompleteLibrary.AddPHPEntry(LibName, pitProperty, fieldname, desc, "", pscUnknown, is_static, "", classname, "", rettype);
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add PHP Built In Method") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      classname       = _v(matches, [0, 1])
      funcname        = _v(matches, [1, 1]);
      funcsignature   = _v(matches, [2, 1]);
      phpobjini.WriteString(classname, funcname, funcsignature);
      
      if (phpclasses.IndexOf(classname) == -1) {
        phpclasses.Add(classname);
      }
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add PHP Built In Func") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      funcname = _v(matches, [0, 1]);
      funcargs = _v(matches, [1, 1]);
      rettype  = _v(matches, [2, 1]);
      desc     = _v(matches, [3, 1]);
      if (phpfuncnames.indexOf(funcname) == -1) {
        var n = phpfuncnames.Add(funcname);
        phpfunc.Insert(n, funcname + "=" + rettype + " " + funcname + " " + funcargs + " - " + desc);
        phpfuncshow.Insert(n, rettype + "{\\rtf\\b " + funcname + "} " + funcargs);
      }
      
    } else {
      alert("not found " + data);
    }
  }
}  


function OnWebkitLoadEnd(Sender, Browser, Frame, Status, Res) {
  if (Frame.Url == WebkitLoadingUrl) {
    Script.TimeOut(1, CallbackAfterLoad);    
  }
}

function OnWebkitConsoleMessage(Sender, browser, message, source, line, Res) {  
  if ((pos("was truncated to its numeric prefix.", message) == 0) && (pos("is not a valid key-value pair separator.", message) == 0) && (pos("is invalid, and has been ignored.", message) == 0)) {
    Script.Message(_t(line) + ":" + source + ":" + message);
  }
}



function DoStartScraping() {
  SL = new TStringList;
  SL.LoadFromFileWithEncoding(Script.GetPath + "func.js", enUtf8NoBom);
  SL2 = new TStringList;
  SL2.LoadFromFileWithEncoding(Script.GetPath + ScriptToExecute, enUtf8NoBom);
  
  SL.Text = SL.Text + SL2.Text;
  web.ExecuteJavaScript(SL.text);
  
  delete SL;
  delete SL2;
  
  //give javascript some time to execute; this of course isn't very safe but good enough for scraping
  Script.TimeOut(TimeReservedForScriptExecution, &OnTimerFinishedLoading);
}

function OnTimerFinishedLoading(Sender) {
  IsLoadingUrl = false;
}

function OnTimerProcessQueue(Sender) {

  var failed = false;
  do {
  
    failed = false;
    
    if ((!IsLoadingUrl) && (UrlQueue.Count > 0) && (ScriptQueue.Count > 0)) {
    
      var Url = UrlQueue[0];
      var js = ScriptQueue[0];
      UrlQueue.Delete(0);
      ScriptQueue.Delete(0);
      
      var loaded = WebkitLoadUrl(Url, js);
      failed = !loaded;
      
      TimesQueueEmpty = 0;
      
    } else if ((!IsLoadingUrl) && (UrlQueue.Count == 0) && (ScriptQueue.Count == 0) && (CallbackOnQueueEmpty != "")) {
    
      TimesQueueEmpty = TimesQueueEmpty + 1;
      if (TimesQueueEmpty >= 5) {
        Script.TimeOut(1, CallbackOnQueueEmpty);
        CallbackOnQueueEmpty = "";
      }
    }
  } 
  while(failed);
  
  Script.TimeOut(QueueProcessInterval, &OnTimerProcessQueue);
}


function OnExit() {
  if (web != null) {
    delete web;
  }
  if (win != null) {
    delete win;
  }
}

function ScrapeWordpress(Sender) {
  LibName = "Wordpress";
  AutoCompleteLibrary.DeleteLibrary(LibName);  
  
  LibName = "WordPress";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  // scrape all functions
  UrlQueue.Add("https://developer.wordpress.org/reference/functions/");
  ScriptQueue.Add("wordpress_func_list.js");
  //scrape all classes
  UrlQueue.Add("https://developer.wordpress.org/reference/classes/");
  ScriptQueue.Add("wordpress_class_list.js");

  CreateWebkit(&DoStartScraping);
  
}

function DeleteWordpress(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Wordpress");
}

function ScrapeZend(Sender) {
  LibName = "Zend Framework";
  
  //Zend Framework documentation prepared with PhpDocumentor and hosted locally for scraping

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
    
  UrlQueue.Add("http://192.168.0.102/zfdoc/classes/");
  ScriptQueue.Add("zend_class_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteZend(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Zend Framework");
}

function ScrapeCakePHP(Sender) {
  LibName = "CakePHP";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
  //UrlQueue.Add("https://api.cakephp.org/3.5/class-Cake.Auth.BasicAuthenticate.html");
  //ScriptQueue.Add("cakephp_class.js");
  //UrlQueue.Add("http://api.cakephp.org/3.1/function-collection.html");
  //ScriptQueue.Add("cakephp_func.js");
  UrlQueue.Add("https://api.cakephp.org/3.5/");
  ScriptQueue.Add("cakephp_class_func_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteCakePHP(Sender) {
  AutoCompleteLibrary.DeleteLibrary("CakePHP");
}

function ScrapeLaravel(Sender) {
  LibName = "Laravel";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
//  UrlQueue.Add("https://laravel.com/api/5.2/Illuminate/Routing/Router.html");
//  ScriptQueue.Add("laravel_class.js");
  UrlQueue.Add("https://laravel.com/api/5.6/classes.html");
  ScriptQueue.Add("laravel_class_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteLaravel(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Laravel");
}

function ScrapeYii(Sender) {
  LibName = "Yii";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
  //UrlQueue.Add("http://www.yiiframework.com/doc-2.0/yii-base-widget.html");
  //ScriptQueue.Add("yii_class.js");
  UrlQueue.Add("http://www.yiiframework.com/doc-2.0/index.html");
  ScriptQueue.Add("yii_class_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteYii(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Yii");
}

function ScrapeNette(Sender) {
  LibName = "Nette";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
  //UrlQueue.Add("https://api.nette.org/2.3.8/Nette.Forms.Form.html");
  //ScriptQueue.Add("nette_class.js");
  UrlQueue.Add("https://api.nette.org/2.3.8/");
  ScriptQueue.Add("nette_class_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteNette(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Nette");
}

function ScrapeCI(Sender) {
  LibName = "CodeIgniter";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  //CodeIgniter documentation prepared with PhpDocumentor and hosted locally for scraping
  
  //UrlQueue.Add("http://192.168.0.102/codeigniter_doc/classes/CI_Loader.html");
  //ScriptQueue.Add("codeigniter_class.js");
  UrlQueue.Add("http://192.168.0.102/codeigniter_doc/");
  ScriptQueue.Add("codeigniter_class_func_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteCI(Sender) {
  AutoCompleteLibrary.DeleteLibrary("CodeIgniter");
}

function ScrapeSymfony(Sender) {
  LibName = "Symfony";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
  UrlQueue.Add("http://api.symfony.com/4.0/classes.html");
  ScriptQueue.Add("symfony_class_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteSymfony(Sender) {
  AutoCompleteLibrary.DeleteLibrary("Symfony");
}

function ScrapePHP(Sender) {

  if (confirm("PHP Documentation scraper will create INI files with standard function and object reference. You will need to copy them to WeBuilder or Rapid PHP folder manually after the scraping has finished.\nDo you want to continue?")) {

    CallbackOnQueueEmpty = &PhpScrapingFinished;
    
    //download PHP documentation from http://www.php.net/get/php_manual_en.tar.gz/from/a/mirror and host it locally for scraping
    
//    UrlQueue.Add("http://localhost/php-chunked-xhtml/mysqli.autocommit.html");
//    ScriptQueue.Add("php_func_method.js");
//    UrlQueue.Add("http://localhost/php-chunked-xhtml/book.array.html");
//    ScriptQueue.Add("php_funclist.js");
    UrlQueue.Add("http://localhost/php-chunked-xhtml/extensions.alphabetical.html");
    ScriptQueue.Add("php_big.js");

    var SL = new TStringList;
    SL.Clear;
    SL.SaveToFile(Script.GetPath + "phpobj.ini");
    delete SL;
    phpobjini = new TIniFile(Script.GetPath + "phpobj.ini");
    phpclasses = new TStringList;
    phpclasses.Sorted = true;
    phpfuncnames = new TStringList;
    phpfuncnames.Sorted = true;
    phpfunc = new TStringList;
    phpfuncshow = new TStringList;
    
    UniqueUrls = new TStringList;
    UniqueUrls.Sorted = true;
    UniqueUrls.Duplicates = dupError;
    
    CreateWebkit(&DoStartScraping);
    
  }  
}

function PhpScrapingFinished() {
  delete phponbjini;
  
  var SL = new TStringList;
  SL.LoadFromFile(Script.GetPath + "phpobj.ini");
  SL.Add("[%objects]");
  var f;
  for (f = 0; f < phpclasses.Count; f++) {
    SL.Add(phpclasses[f]);
  }
  SL.SaveToFile(Script.GetPath + "phpobj.ini");
  delete SL;
  
  phpfuncnames.SaveToFile(Script.GetPath + "phpfunc_names.ini");
  delete phpfuncnames;
  phpfunc.SaveToFile(Script.GetPath + "phpfunc.ini");
  delete phpfunc;
  phpfuncshow.SaveToFile(Script.GetPath + "phpfunc_show.ini");
  delete phpfuncshow;
  
  delete UniqueUrls;
  UniqueUrls = null;
  
  alert("PHP scraping finished. The following files were created:\nphpfunc.ini\nphpfunc_names.ini\nphpfunc_show.ini\nphpobj.ini\n\nPlease copy these files from " + Script.GetPath + " to " + ExtractFilePath(Application.ExeName) + "data\\ folder.");
}

Script.RegisterAction("Scrape Frameworks", "Scrape Wordpress", "", &ScrapeWordpress);
Script.RegisterAction("Scrape Frameworks", "Delete Wordpress", "", &DeleteWordpress);
Script.RegisterAction("Scrape Frameworks", "Scrape Zend Framework", "", &ScrapeZend);
Script.RegisterAction("Scrape Frameworks", "Delete Zend Framework", "", &DeleteZend);
Script.RegisterAction("Scrape Frameworks", "Scrape CakePHP", "", &ScrapeCakePHP);
Script.RegisterAction("Scrape Frameworks", "Delete CakePHP", "", &DeleteCakePHP);
Script.RegisterAction("Scrape Frameworks", "Scrape Laravel", "", &ScrapeLaravel);
Script.RegisterAction("Scrape Frameworks", "Delete Laravel", "", &DeleteLaravel);
Script.RegisterAction("Scrape Frameworks", "Scrape Yii", "", &ScrapeYii);
Script.RegisterAction("Scrape Frameworks", "Delete Yii", "", &DeleteYii);
Script.RegisterAction("Scrape Frameworks", "Scrape Nette", "", &ScrapeNette);
Script.RegisterAction("Scrape Frameworks", "Delete Nette", "", &DeleteNette);
Script.RegisterAction("Scrape Frameworks", "Scrape CodeIgniter", "", &ScrapeCI);
Script.RegisterAction("Scrape Frameworks", "Delete CodeIgniter", "", &DeleteCI);
Script.RegisterAction("Scrape Frameworks", "Scrape Symfony", "", &ScrapeSymfony);
Script.RegisterAction("Scrape Frameworks", "Delete Symfony", "", &DeleteSymfony);
Script.RegisterAction("Scrape Frameworks", "Scrape PHP documentation", "", &ScrapePHP);

Script.ConnectSignal("exit", &OnExit);

