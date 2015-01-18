'use strict';

var Pack    = require('./pack');
var Package = require('./package');

exports.load = function (packages) {
  return new Pack().load(packages);
};

exports.Pack = Pack;
exports.Package = Package;
