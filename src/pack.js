'use strict';

var Promise = require('bluebird');
var Package = require('./package');
var errors  = require('core-error-predicates');

function Pack () {
  this.packages = [];
}

Pack.prototype.load = function (packages) {
  return Promise.map(packages, normalizePackage)
    .reduce(readPackage, this.packages)
    .return(this);
};

function normalizePackage (pkg) {
  if (typeof pkg === 'string') {
    return {
      path: pkg
    };
  }
  return pkg;
}

function readPackage (packages, pkg) {
  return new Package(pkg.path).read()
    .then(function (pkg) {
      packages.push(pkg);
      return packages;
    })
    .catch(errors.FileNotFoundError, function (err) {
      if (!pkg.optional) throw err;
    });
}

Pack.prototype.get = function () {
  var primary = this.packages[0];
  return primary.get.apply(primary, arguments);
};

Pack.prototype.set = function () {
  var args = arguments;
  this.packages.forEach(function (pkg) {
    pkg.set.apply(pkg, args);
  });
  return this;
};

['read', 'write'].forEach(function (method) {
  Pack.prototype[method] = function () {
    var args = arguments;
    return Promise.map(this.packages, function (pkg) {
      return pkg[method].apply(pkg, args);
    })
    .return(this);
  };
});

Pack.prototype.paths = function () {
  return this.packages.map(function (pkg) {
    return pkg.path;
  });
};

module.exports = Pack;
