'use strict';

var expect  = require('chai').expect;
var sinon   = require('sinon');
var fs      = require('fs');
var Package = require('../').Package;

describe('Package', function () {

  var pkg, sandbox;
  beforeEach(function () {
    pkg = new Package('./package.json');
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('resolves to an absolute path', function () {
    expect(pkg.path).to.match(/\/package.json$/);
  });

  describe('#get', function () {

    it('gets data by property', function () {
      pkg.data.foo = 'bar';
      expect(pkg.get('foo')).to.equal('bar');
    });

  });

  describe('#set', function () {

    it('can set a key/val pair', function () {
      expect(pkg.set('foo', 'bar').get('foo')).to.equal('bar');
    });

    it('can set an object', function () {
      expect(pkg.set({foo: 'bar'}).get('foo')).to.equal('bar');
    });

  });

  describe('#read', function () {

    var readFile;
    beforeEach(function () {
      readFile = sandbox.stub(fs, 'readFile');
    });

    it('reads the data to JSON', function () {
      readFile.yields(null, new Buffer(JSON.stringify({
        foo: 'bar'
      })));
      return pkg.read().then(function (pkg) {
        expect(pkg.get('foo')).to.equal('bar');
      });
    });

    it('detects indentation', function () {
      readFile.yields(null, new Buffer(JSON.stringify({
        foo: 'bar'
      }, null, '\t')));
      return pkg.read().then(function (pkg) {
        expect(pkg.indent).to.equal('\t');
      });
    });

  });

  describe('#write', function () {

    it('writes the data as json', function () {
      sandbox.stub(fs, 'writeFile').yields(null);
      return pkg.write();
    });

  });

});
