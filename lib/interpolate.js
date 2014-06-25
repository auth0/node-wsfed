function getProp(obj, path) {
  return path.split('.').reduce(function (prev, curr) {
    return prev[curr];
  }, obj);
}

module.exports = function (tmpl) {
  return function (model) {
    tmpl.replace(/\@\@([^\@]*)\@\@/g,
      function (a, b) {
        var r = getProp(model, b);
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
  };
};