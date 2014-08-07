var QueueProcessInterval = 500;

var win = null;
var web = null;
var CallbackAfterLoad;
var WebkitLoadingUrl = "";
var ScriptToExecute = "";
var UrlQueue = new TStringList;
var ScriptQueue = new TStringList;
var matches;
var IsLoadingUrl = false;
var LibName = "test";


function WebkitLoadUrl(Url, Js) {
  WebkitLoadingUrl = Url;
  ScriptToExecute = Js;
  IsLoadingUrl = true;
  web.Webkit.Load(Url);
}

function OnWebkitCreated(Sender, Browser) {
  web.Webkit.Top = 0;
  web.Webkit.Left = 0;
  web.Webkit.Width = win.ClientWidth;
  web.Webkit.Height = win.ClientHeight;
  web.Webkit.Anchors = akLeft || akRight || akTop || akBottom;
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
     web.Subscribe("Framework Scraper Add Method", &OnWebkitData);
     web.Subscribe("Framework Scraper Add Field", &OnWebkitData);
     web.OnLoadEnd = &OnWebkitLoadEnd;
     web.OnConsoleMessage = &OnWebkitConsoleMessage;
     Created = true;
     CallbackAfterLoad = Callback;
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
    
  if (channel == "Framework Scraper Load Url") {
    var i = Pos(":", data);
    if (i > 0) {
      var js = copy(data, 1, i - 1);
      var url = copy(data, i + 1, Length(data));
      
      UrlQueue.Add(url);
      ScriptQueue.Add(js);

    }
  } else if (channel == "Framework Scraper Add Class") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      classname = _v(matches, [0, 1]);
      desc      = _v(matches, [1, 1]);
      inheritance = _v(matches, [2, 1]);
      AutoCompleteLibrary.AddPHPEntry(LibName, pitClass, classname, desc, inheritance, pscUnknown, False, "", "", "");
      
    } else {
      alert("not found " + data);
    }
  } else if (channel == "Framework Scraper Add Func") {
    
    if (RegexMatchAll(data, "<\\|\\|\\|>(.*?)<\\|\\|\\|>", True, matches, poses)) {
      funcname = _v(matches, [0, 1]);
      funcargs = _v(matches, [1, 1]);
      rettype  = _v(matches, [2, 1]);
      desc     = _v(matches, [3, 1]);
      AutoCompleteLibrary.AddPHPEntry(LibName, pitFunction, funcname, desc, "", pscUnknown, False, funcargs, "", rettype);
      
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
      AutoCompleteLibrary.AddPHPEntry(LibName, pitFunction, funcname, desc, "", pscUnknown, is_static, funcargs, classname, rettype);
      
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
      AutoCompleteLibrary.AddPHPEntry(LibName, pitProperty, fieldname, desc, "", pscUnknown, is_static, "", classname, rettype);
      
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
  if (pos("Viewport argument value", message) == 0) { //do not display these messages coming from Zend documentation
    alert(_t(line) + ":" + source + ":" + message);
  }
}



function DoStartScraping() {
  SL = new TStringList;
  SL.LoadFromFile(Script.GetPath + ScriptToExecute);
  web.ExecuteJavaScript(SL.text);
  delete SL;
  //give javascript some time to execute; this of course isn't very safe but good enough for scraping
  Script.TimeOut(50, &OnTimerFinishedLoading);
}

function OnTimerFinishedLoading(Sender) {
  IsLoadingUrl = false;
}

function OnTimerProcessQueue(Sender) {
  if ((!IsLoadingUrl) && (UrlQueue.Count > 0) && (ScriptQueue.Count > 0)) {
    var Url = UrlQueue[0];
    var js = ScriptQueue[0];
    UrlQueue.Delete(0);
    ScriptQueue.Delete(0);
    WebkitLoadUrl(Url, js);
  }
  Script.TimeOut(QueueProcessInterval, &OnTimerProcessQueue);
}


function ScrapeWordpress(Sender) {
  LibName = "Wordpress";

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

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  
  //UrlQueue.Add("http://localhost/ZendFramework-2.3.1-apidoc/classes/Zend.Barcode.Barcode.html");
  //ScriptQueue.Add("zend_class.js");
  UrlQueue.Add("http://localhost/ZendFramework-2.3.1-apidoc/packages/Default.html");
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
  
  
  //UrlQueue.Add("http://api.cakephp.org/2.5/class-CakeTestModel.html");
  //ScriptQueue.Add("cakephp_class.js");
  UrlQueue.Add("http://api.cakephp.org/2.5/");
  ScriptQueue.Add("cakephp_class_func_list.js");
  
  CreateWebkit(&DoStartScraping);
  
}

function DeleteCakePHP(Sender) {
  AutoCompleteLibrary.DeleteLibrary("CakePHP");
}

Script.RegisterAction("Scrape Frameworks", "Scrape Wordpress", "", &ScrapeWordpress);
Script.RegisterAction("Scrape Frameworks", "Delete Wordpress", "", &DeleteWordpress);
Script.RegisterAction("Scrape Frameworks", "Scrape Zend Framework", "", &ScrapeZend);
Script.RegisterAction("Scrape Frameworks", "Delete Zend Framework", "", &DeleteZend);
Script.RegisterAction("Scrape Frameworks", "Scrape CakePHP", "", &ScrapeCakePHP);
Script.RegisterAction("Scrape Frameworks", "Delete CakePHP", "", &DeleteCakePHP);

