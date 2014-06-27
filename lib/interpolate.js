function getProp(obj, path) {
  return path.split('.').reduce(function (prev, curr) {
    return prev[curr];
  }, obj);
}

function escape (html){
  return String(html)
    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
}

module.exports = function (tmpl) {
  return function (model) {
    return tmpl.replace(/\@\@([^\@]*)\@\@/g,
      function (a, b) {
        var r = getProp(model, b);
        var value = typeof r === 'string' || typeof r === 'number' ? r : a;
        return escape(value);
      }
    );
  };
};