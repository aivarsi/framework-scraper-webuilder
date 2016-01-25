jQuery('table.summaryTable tr td:first-child a').each(function(i) {
  WeBuilderExtract("yii_class.js", this.href);
});
