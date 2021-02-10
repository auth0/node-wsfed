var expect = require('chai').expect;
var server = require('./fixture/server');
var request = require('request');
var cheerio = require('cheerio');
var xmlhelper = require('./xmlhelper');
var fs = require('fs');
var path = require('path');

describe('wsfed', function () {
  before(function (done) {
    server.start(done);
  });
  
  after(function (done) {
    server.close(done);
  });

  describe('authorizing', function () {
    var body, $, signedAssertion, attributes;

    before(function (done) {
      request.get({
        jar: request.jar(), 
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:the-super-client-id'
      }, function (err, response, b){
        if(err) return done(err);
        body = b;
        $ = cheerio.load(body);
        var wresult = $('input[name="wresult"]').attr('value');
        signedAssertion = /<t:RequestedSecurityToken>(.*)<\/t:RequestedSecurityToken>/.exec(wresult)[1];
        attributes = xmlhelper.getAttributes(signedAssertion);
        done();
      });
    });

    it('should contain a form in the result', function(){
      expect(body).to.match(/<form/);
    });

    it('should contain the wctx input', function () {
      expect($('input[name="wctx"]').attr('value')).to.equal('123');
    });

    it('should contain a valid signal assertion', function(){
      var isValid = xmlhelper.verifySignature(
                signedAssertion, 
                server.credentials.cert);
      expect(isValid).to.be.ok;
    });

    it('should use sha256 as default signature algorithm', function(){
      var algorithm = xmlhelper.getSignatureMethodAlgorithm(signedAssertion);
      expect(algorithm).to.equal('http://www.w3.org/2001/04/xmldsig-more#rsa-sha256');
    });

    it('should use sha256 as default diigest algorithm', function(){
      var algorithm = xmlhelper.getDigestMethodAlgorithm(signedAssertion);
      expect(algorithm).to.equal('http://www.w3.org/2001/04/xmlenc#sha256');
    });

    it('should map every attributes from profile', function(){
      function validateAttribute(position, name, value) {
        expect(attributes[position].getAttribute('AttributeName'))
          .to.equal(name);
        expect(attributes[position].firstChild.textContent)
          .to.equal(value);
      }

      validateAttribute(0, 'nameidentifier', server.fakeUser.id);
      validateAttribute(1, 'emailaddress',   server.fakeUser.emails[0].value);
      validateAttribute(2, 'name',           server.fakeUser.displayName);
      validateAttribute(3, 'givenname',      server.fakeUser.name.givenName);
      validateAttribute(4, 'surname',         server.fakeUser.name.familyName);
    });

    it('should contains the name identifier', function(){
      expect(xmlhelper.getNameIdentifier(signedAssertion).textContent)
        .to.equal(server.fakeUser.id);
    });

    it('should set name identifier format to urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified by default', function (){
      const nameIdentifier = xmlhelper.getNameIdentifier(signedAssertion);
      const formatAttributeValue = nameIdentifier.getAttribute('Format');
      expect(formatAttributeValue).to.equal('urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified');
    });

    it('should contains the issuer', function(){
      expect(xmlhelper.getIssuer(signedAssertion))
        .to.equal('urn:fixture-test');
    });

    it('should contains the audiences', function(){
      expect(xmlhelper.getAudiences(signedAssertion)[0].textContent)
        .to.equal('urn:the-super-client-id');
    });

    it('should contain the callback', function () {
      expect($('form').attr('action')).to.equal('http://office.google.com');
    });
  });

  describe('when a name identifier format is passed as an auth option', function (){
    var body, $, signedAssertion, attributes;

    const fakeNameIdentifierFomat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:swfedfakeformat';

    before(function (done) {
      server.options = { nameIdentifierFormat: fakeNameIdentifierFomat };
      request.get({
        jar: request.jar(),
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:the-super-client-id'
      }, function (err, response, b){
          if(err) return done(err);
          body = b;
          $ = cheerio.load(body);
          var wresult = $('input[name="wresult"]').attr('value');
          signedAssertion = /<t:RequestedSecurityToken>(.*)<\/t:RequestedSecurityToken>/.exec(wresult)[1];
          attributes = xmlhelper.getAttributes(signedAssertion);
          done();
      });
    });

    it(`should set name identifier format to the passed auth option`, function (){
      const nameIdentifier = xmlhelper.getNameIdentifier(signedAssertion);
      const formatAttributeValue = nameIdentifier.getAttribute('Format');
      expect(formatAttributeValue).to.equal(fakeNameIdentifierFomat);
    });
  });

  describe('when the audience has colon(:)', function (){
    it('should work', function (done) {
      request.get({
        jar: request.jar(), 
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:auth0:superclient'
      }, function (err, response, b){
        if(err) return done(err);
        var body = b;
        var $ = cheerio.load(body);
        var wresult = $('input[name="wresult"]').attr('value');
        var signedAssertion = /<t:RequestedSecurityToken>(.*)<\/t:RequestedSecurityToken>/.exec(wresult)[1];

        expect(xmlhelper.getAudiences(signedAssertion)[0].textContent)
          .to.equal('urn:auth0:superclient');

        done();
      });
    });
  });

  describe('when the wctx has ampersand(&)', function (){
    it('should return escaped Context value', function (done) {
      var wctx = encodeURIComponent('rm=0&id=passive&ru=%2f');

      request.get({
        jar: request.jar(), 
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=' + wctx + '&wtrealm=urn:auth0:superclient'
      }, function (err, response, b){
        if(err) return done(err);
        var body = b;
        var $ = cheerio.load(body);
        var wresult = $('input[name="wresult"]').attr('value');

        expect(wresult.indexOf(' Context="rm=0&amp;id=passive&amp;ru=%2f" '))
          .to.be.above(-1);

        done();
      });
    });
  });

  describe('when attribute has ampersand(&)', function (){
    it('should return escaped value', function (done) {
      server.fakeUser.attribute_with_ampersand = 'http://foo?foo&foo';
      request.get({
        jar: request.jar(), 
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wtrealm=urn:auth0:superclient'
      }, function (err, response, b){
        if(err) return done(err);
        var body = b;
        var $ = cheerio.load(body);
        var wresult = $('input[name="wresult"]').attr('value');

        expect(wresult.indexOf('http://foo?foo&amp;foo'))
          .to.be.above(-1);

        delete server.fakeUser.attribute_with_ampersand;
        done();
      });
    });
  });

  describe('when using an invalid callback url', function () {
    it('should return error', function(done){
      request.get({
        jar: request.jar(), 
        uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:auth0:superclient&wreply=http://google.comcomcom'
      }, function (err, response){
        if(err) return done(err);
        expect(response.statusCode)
          .to.equal(400);
        done();
      });
    });
  });

  describe('using custom profile mapper', function() {
    describe('when NameIdentifier and NameIdentifierFormat have been configured', function() {
      const fakeNameIdentifier = 'fakeNameIdentifier';
      const fakeNameIdentifierFormat = 'fakeNameIdentifierFormat';
      var body, $, signedAssertion, attributes;

      function ProfileMapper(user) {
        this.user = user;
      }
      ProfileMapper.prototype.getClaims = function () {
        return this.user;
      }
      ProfileMapper.prototype.getNameIdentifier = function () {
        return {
          nameIdentifier: fakeNameIdentifier,
          nameIdentifierFormat: fakeNameIdentifierFormat,
        };
      }

      before(function () {
        server.options = {
          profileMapper: function createProfileMapper(user) {
            return new ProfileMapper(user);
          }
        };
      });

      function createRequest(done) {
        request.get({
          jar: request.jar(),
          uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:the-super-client-id'
        }, function (err, response, b) {
          if (err) return done(err);
          body = b;
          $ = cheerio.load(body);
          var wresult = $('input[name="wresult"]').attr('value');
          signedAssertion = /<t:RequestedSecurityToken>(.*)<\/t:RequestedSecurityToken>/.exec(wresult)[1];
          attributes = xmlhelper.getAttributes(signedAssertion);
          done();
        });
      }

      describe('when nameIdentifierFormat option has been passed', function() {

        const fakeOptionNameIdentifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:swfedfakeformat';

        before(function(done) {
          server.options.nameIdentifierFormat = fakeOptionNameIdentifierFormat;
          createRequest(done);
        });

        it('should set name identifier', function() {
          const nameIdentifierValue = xmlhelper.getNameIdentifier(signedAssertion).textContent;
          expect(nameIdentifierValue).to.equal(fakeNameIdentifier);
        });

        it('should set name identifier format', function() {
          const nameIdentifier = xmlhelper.getNameIdentifier(signedAssertion);
          const formatAttributeValue = nameIdentifier.getAttribute('Format');
          expect(formatAttributeValue).to.equal(fakeNameIdentifierFormat);
        });

      });

      describe('when nameIdentifierFormat option has NOT been passed', function() {

        before(function(done) {
          createRequest(done);
        });

        it('should set name identifier', function() {
          const nameIdentifierValue = xmlhelper.getNameIdentifier(signedAssertion).textContent;
          expect(nameIdentifierValue).to.equal(fakeNameIdentifier);
        });

        it('should set name identifier format', function() {
          const nameIdentifier = xmlhelper.getNameIdentifier(signedAssertion);
          const formatAttributeValue = nameIdentifier.getAttribute('Format');
          expect(formatAttributeValue).to.equal(fakeNameIdentifierFormat);
        });

      });
    });

    describe('when NameIdentifier is not found', function(){
      function ProfileMapper(user) {
        this.user = user;
      }
      ProfileMapper.prototype.getClaims = function () {
        return this.user;
      }
      ProfileMapper.prototype.getNameIdentifier = function () {
        return null;
      }

      before(function () {
        server.options = {
          profileMapper: function createProfileMapper(user) {
            return new ProfileMapper(user)
          }
        };
      });

      it('should return an error', function(done){
        request.get({
          jar: request.jar(),
          uri: 'http://localhost:5050/wsfed?wa=wsignin1.0&wctx=123&wtrealm=urn:the-super-client-id'
        }, function (err, response){
          if(err) return done(err);
          expect(response.statusCode).to.equal(400);
          expect(response.body).to.equal('No attribute was found to generate the nameIdentifier');
          done();
        });
      });
    });
  });
});

