jQuery('div.package-indent h1 a').each(function(i) {
    if (this.href.trim().indexOf('classes/Zend.Filter.Compress.Gz.html') == -1) {
        WeBuilderExtract("zend_class.js", this.href.trim());
    }
});