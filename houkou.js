function merge(a, b) {
  var r = {};
  for (var i=0;i<a.length;++i) {
    r[a[i]] = b[i];
  }
  return r;
}

function Houkou(pattern, cfg) {
  if (!(this instanceof Houkou)) {
    return new Houkou(pattern);
  }

  var self = this;

  this.cfg = cfg || {};
  this.cfg.requirements || (this.cfg.requirements = {});
  this.cfg.defaults || (this.cfg.defaults = {});

  this.parameters = (pattern.match(/:([a-z_]+)/gi) || []).map(function(p) { return p.substr(1); });
  this.pattern = new RegExp(("^" + pattern.replace(/\//g, "\\/").replace(/\./g, "\\.").replace(/:([a-z_]+)/gi, function(m,t) { return "(" + (self.cfg.requirements[t] || ".+?") + ")"}) + "$"));
  this.build = new Function("v", 'return "' + pattern.replace(/:([a-z_]+)/gi, '" + (v["$1"] || this.cfg.defaults["$1"]) + "') + '";');
}

Houkou.prototype.match = function(url) {
  var matches;

  if (matches = this.pattern.exec(url)) {
    matches.shift();
    return merge(this.parameters, matches);
  }

  return false;
};

(typeof module === "object") && (module.exports = Houkou);
