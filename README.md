Framework scraper plugin for Webuilder/RapidPHP 2016
====================================================

This is Framework Scraper plugin for following editors:

Webuilder: http://www.webuilderapp.com/ <br>
RapidPHP: http://www.rapidphpeditor.com/

Scrapes data for auto-complete and object browser from documentation
of frameworks.

Supports following frameworks:

  - WordPress
  - Zend Framework
  - CakePHP
  - Laravel
  - Yii

Also scrapes PHP built-in documentation.


Development guide
=================

## Basic principles

The main steps of scraping process are:
  1. Load URL in browser
  2. Evaluate the specified JavaScript file (scraper), that
    1. Processes DOM of loaded document
    2. Sends scraped data to plugin
    3. Sends additional URL(s) to scrape and corresponding scraper names to plugin

Most often you will need to traverse multiple URLs to fully scrape all documentation of the framework. You might have list of classes in one URL, then each class in another URL and so on. The basic idea is to write a separate scraper for class list, another scraper for the class and so on.

It's worth to note that although main plugin script (script.js) is written in JScript, the scrapers are written in JavaScript.

Examine existing scrapers (e.g zend_class_list.js and zend_class.js) to get an idea how they work.

## Notes about supported frameworks

Unlike other frameworks, Zend Framework and PHP documentation are scanned from localhost, so you need to download the documentation before you can scan it.

Zend Framework documentation. Download from https://packages.zendframework.com/releases/ZendFramework-2.3.1/ZendFramework-2.3.1-apidoc.zip and extract to http://localhost/ZendFramework-2.3.1-apidoc/

PHP documentation. Download from http://www.php.net/distributions/manual/php_manual_en.tar.gz and extract to http://localhost/php-chunked-xhtml/

## Adding a new framework of your choice

Add new procedures for processing your Framework:

```
function Scrape<FRAMEWORK_NAME_HERE>(Sender) {
  LibName = "<FRAMEWORK_NAME_HERE>";

  AutoCompleteLibrary.DeleteLibrary(LibName);
  AutoCompleteLibrary.AddPHPLibrary(LibName);
  
  UrlQueue.Add("<URL to framework documentation>");
  ScriptQueue.Add("<name of new scraper.js>");
  
  CreateWebkit(&DoStartScraping);
  
}

function Delete<FRAMEWORK_NAME_HERE>(Sender) {
  AutoCompleteLibrary.DeleteLibrary("<FRAMEWORK_NAME_HERE>");
}
```

Add new actions for menu:

```
Script.RegisterAction("Scrape Frameworks", "Scrape <FRAMEWORK_NAME_HERE>", "", &Scrape<FRAMEWORK_NAME_HERE>);
Script.RegisterAction("Scrape Frameworks", "Delete <FRAMEWORK_NAME_HERE>", "", &Delete<FRAMEWORK_NAME_HERE>);
```

Create new JavaScript file that will be the scraper. You might want to use jQuery for scraping. Sometimes documentation will have included by default, if not the plugin will do it for you.
If jQuery is included in the documentation documents by default, your scraper can start the work right away. Otherwise you need to use a special event:

```
jquery_script.onload = function() {

  ... scraper code here...

}
```

Don't forget to restart the editor after scraping to have all new scraped classes, class attributes and functions available in auto-complete and Language Browser.

## Sample scraper

This scraper traverses all Anchor elements containing class "function" and tells plugin that URLs in the href must be scraped using scraper some_scraper_name.js.

```
jQuery('a.function').each(function(i) {
    WeBuilderExtract("some_scraper_name.js", this.href);
  });
```

## Functions that can be used in scrapers

**WeBuilderExtract**(scraper, url) - Load the specified URL and evaluate the specified scraper JavaScript file.
```
WeBuilderExtract("some_scraper.js", this.href.trim());
```

**WeBuilderAddClass**(class_name, description, inherits) - Add class to auto-complete. You can leave "inherits" empty or if the class inherits any attributes from the parent class, specify them in following format: "ParentClassName::$attr,...,method(),..." or "ParentClassName::$attr,...,method(),...;ParentClassName2::...".
```
WeBuilderAddClass("Model", "Object-relational mapper.", "")
```

**WeBuilderAddMethod**(class_name, funcname, funcargs, result_type, description, is_static) - Add class method to auto-complete.
```
WeBuilderAddMethod("Model", "delete", "( integer $id = null , boolean $cascade = true )", "boolean", "Removes record for given ID. If no ID is given, the current ID is used. Returns true on success.", false)
```

**WeBuilderAddProperty**(class_name, fieldname, fieldtype, description, is_static) - Add class property to auto-complete.
```
WeBuilderAddProperty("Model", "$data", "array", "Container for the data that this model gets from persistent storage (usually, a database).", false)
```

**WeBuilderAddFunction**(funcname, funcargs, result_type, description) - Add function to auto-complete.
```
WeBuilderAddFunction("clearCache", "(string $params = null, string $type = 'views', string $ext = '.php')", "boolean", "Used to delete files in the cache directories, or clear contents of cache directories")
```
