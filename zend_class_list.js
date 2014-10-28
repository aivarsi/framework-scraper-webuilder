jQuery('div.package-indent h1 a').each(function(i) {
    WeBuilderExtract("zend_class.js", this.href.trim());
});