'use strict';

var Promise = require('bluebird');
var fs      = Promise.promisifyAll(require('fs'));
var indent  = require('detect-indent');
var extend  = require('xtend/mutable');
var path    = require('path');


function Package (pkgPath) {
  this.path = path.resolve(process.cwd(), pkgPath);
  this.data = {};
  this.indent = '  ';
}

Package.prototype.get = function (property) {
  return this.data[property];
};

Package.prototype.set = function (property, value) {
  if (typeof property === 'string') {
    this.data[property] = value;
  }
  else {
    extend(this.data, property);
  }
  return this;
};

Package.prototype.read = function () {
  return fs.readFileAsync(this.path)
    .bind(this)
    .then(function (data) {
      this.indent = indent(data).indent;
      this.data = JSON.parse(data);
      return this;
    });
};

Package.prototype.write = function () {
  return fs.writeFileAsync(this.path, JSON.stringify(this.data, null, this.indent))
    .return(this);
};

module.exports = Package;
