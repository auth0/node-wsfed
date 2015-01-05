var utils = require('./utils');

function getProp(obj, path) {
  return path.split('.').reduce(function (prev, curr) {
    return prev[curr];
  }, obj);
}

module.exports = function (tmpl) {
  return function (model) {
    return tmpl.replace(/\@\@([^\@]*)\@\@/g,
      function (a, b) {
        var r = getProp(model, b);
        var value = typeof r === 'string' || typeof r === 'number' ? r : a;
        return utils.escapeAssertion(value);
      }
    );
  };
};