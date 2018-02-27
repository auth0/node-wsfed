var assert = require('assert');
var encoders = require('../lib/encoders');
var fixtures = require('./fixture/server');

describe('encoders', function () {
  describe('thumbprint', function () {
    it('should return the thumbprint in all caps', function () {
      var certThumbprint = encoders.thumbprint(fixtures.credentials.cert);
      assert.equal(certThumbprint, '499FDF1C2218A99C8595AAC2FD95CE36F0A6D59D');
    });
  });
});
