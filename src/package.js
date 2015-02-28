'use strict';

var Promise  = require('bluebird');
var fs       = Promise.promisifyAll(require('fs'));
var indent   = require('detect-indent');
var extend   = require('xtend/mutable');
var path     = require('path');
var trailing = require('trailing-newline');
var os       = require('os');
var deep     = require('getobject');

function Package (pkgPath) {
  this.path = path.resolve(process.cwd(), pkgPath);
  this.data = {};
  this.indent = '  ';
  this.trailing = false;
}

Package.prototype.get = function (property) {
  return deep.get(this.data, property);
};

Package.prototype.set = function (property, value) {
  if (typeof property === 'string') {
    deep.set(this.data, property, value);
  }
  else {
    extend(this.data, property);
  }
  return this;
};

Package.prototype.read = function () {
  return fs.readFileAsync(this.path)
    .bind(this)
    .call('toString')
    .then(function (data) {
      this.indent = indent(data).indent;
      this.trailing = trailing(data);
      this.data = JSON.parse(data);
      return this;
    });
};

Package.prototype.write = function () {
  var output = JSON.stringify(this.data, null, this.indent);
  if (this.trailing) output += os.EOL;
  return fs.writeFileAsync(this.path, output)
    .return(this);
};

module.exports = Package;
