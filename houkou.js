function merge(a, b) {
  var r = {};
  for (var i=0;i<a.length;++i) {
    r[a[i]] = b[i];
  }
  return r;
}

function Houkou(pattern) {
  this.parameters = (pattern.match(/:([a-z_]+)/gi) || []).map(function(p) { return p.substr(1); });
  this.pattern = new RegExp(("^" + pattern.replace(/:[a-z_]+?!\(|:[a-z_]+$/gi, "(.+?)").replace(/:[a-z_]+/gi, "") + "$").replace(/\//g, "\\/"));
  this.build = new Function("v", 'return "' + pattern.replace(/:([a-z_]+)(?:\(.*?\))?/gi, '" + v["$1"] + "') + '";');
}

Houkou.prototype.match = function(url) {
  var matches;

  if (matches = this.pattern.exec(url)) {
    matches.shift();
    return merge(this.parameters, matches);
  }
};

(typeof module === "object") && (module.exports = Houkou);
