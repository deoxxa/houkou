function merge(a, b) {
  var r = {};
  for (var i=0;i<a.length;++i) {
    r[a[i]] = b[i];
  }
  return r;
}

function Houkou(pattern, cfg) {
  if (!(this instanceof Houkou)) {
    return new Houkou(pattern, cfg);
  }

  var self = this;

  this.cfg = cfg || {};
  this.cfg.requirements || (this.cfg.requirements = {});
  this.cfg.defaults || (this.cfg.defaults = {});
  this.cfg.paramChar || (this.cfg.paramChar = ':');

  var paramRegx = new RegExp(this.cfg.paramChar + '([a-z_]+)', 'gi');

  this.parameters = (pattern.match(paramRegx) || []).map(function(p) { return p.substr(1); });
  this.pattern = new RegExp(("^" + pattern.replace(/\//g, "\\/").replace(/\./g, "\\.").replace(paramRegx, function(m,t) { return "(" + (self.cfg.requirements[t] || ".+?") + ")"; }) + "$"));
  this.build = new Function("v", 'return !this.validate(v) ? false : "' + pattern.replace(paramRegx, '" + ((typeof v["$1"] !== "undefined" && v["$1"] !== null) ? v["$1"] : this.cfg.defaults["$1"]) + "') + '";');
}

Houkou.prototype.validate = function(params) {
  for (var param in params) {
    if (!params.hasOwnProperty(param) || !this.cfg.requirements[param]) {
      continue;
    }
    if (!RegExp(this.cfg.requirements[param]).test(params[param])) {
      return false;
    }
  }
  return true;
};

Houkou.prototype.match = function(url) {
  var matches;

  if (matches = this.pattern.exec(url)) {
    matches.shift();
    return merge(this.parameters, matches);
  }

  return false;
};

(typeof module === "object") && (module.exports = Houkou);
