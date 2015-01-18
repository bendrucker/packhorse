'use strict';

var expect  = require('chai').expect;
var sinon   = require('sinon');
var Pack    = require('../').Pack;
var Package = require('../').Package;

require('sinon-as-promised');

describe('Pack', function () {

  var pack, pkg, sandbox;
  beforeEach(function () {
    pack = new Pack();
    pkg = new Package('./package.json');
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('#load', function () {

    var read;
    beforeEach(function () {
      read = sandbox.stub(Package.prototype, 'read')
    });

    it('reads the packages', function () {
      read.resolves({});
      return pack.load(['./package.json'])
        .then(function (pack) {
          expect(pack.packages).to.have.length(1);
        });
    });

    it('recovers from errors on optional packages', function () {
      read.onCall(0).resolves({});
      read.onCall(1).rejects({
        code: 'ENOENT'
      });
      return pack.load(['./package.json', {
        path: './bower.json',
        optional: true
      }])
      .then(function (pack) {
        expect(pack.packages).to.have.length(1);
      });
    });

  });

  describe('#get', function () {

    it('gets from the first package', function () {
      pack.packages.push(pkg);
      pkg.set('foo', 'bar');
      expect(pack.get('foo')).to.equal('bar');
    });

  });

  describe('#set', function () {

    it('sets on all packages', function () {
      var pkg2 = new Package('./bower.json');
      pack.packages.push(pkg, pkg2);
      pack.set('foo', 'bar');
      expect(pkg.get('foo')).to.equal('bar');
      expect(pkg2.get('foo')).to.equal('bar');
    });

  });

  describe('#read / #write', function () {

    it('calls the method on all packages', function () {
      var read = sandbox.stub(Package.prototype, 'read');
      read.resolves({});
      pack.packages.push(pkg);
      return pack.read().then(function (pack) {
        expect(pack.packages[0].read.callCount).to.equal(1);
      });
    });

  });

  describe('#paths', function () {

    it('gets the package paths', function () {
      pack.packages.push(pkg);
      var paths = pack.paths();
      expect(paths).to.have.length(1);
      expect(paths[0]).to.contain('package.json');
    });

  });

});
