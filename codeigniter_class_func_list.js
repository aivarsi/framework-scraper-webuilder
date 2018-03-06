jQuery('div:has(> section > h2:contains("Functions"))').nextAll('div').each(function(i) {
  var func = $(this).find('article.method pre.signature').text().trim();
  var desc = $(this).find('article>p').first().text().trim();
  var ret = "";
  if ($(this).find('h4:contains("Returns")').length) {
    ret = $(this).find('h4:contains("Returns")').get(0).nextSibling.nodeValue.replace(/[—]/g, '').trim();
  }
  
  var fnNameRegex = /^(.*?)[ \(]/;
  var fnArgsRegex = /\(.*\)/;
  var funcparts = func.match(fnNameRegex);
  var funcargs = func.match(fnArgsRegex);
  var args = funcargs[0].normalize_spaces();

  WeBuilderAddFunction(funcparts[1], args, ret, desc);
});

jQuery('h2:contains("Classes")').next('table').find('tr>td>a').each(function(i) {
  WeBuilderExtract("codeigniter_class.js", this.href);
});
