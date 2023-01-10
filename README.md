WS Federation middleware for node.js.

[![Build Status](https://travis-ci.org/auth0/node-wsfed.png)](https://travis-ci.org/auth0/node-wsfed)

## Installation

    npm install wsfed

## Introduction

This Express middleware is meant to generate a valid WSFederation endpoint that talks saml.

The idea is that you will use another mechanism to validate the user first.

The endpoint supports metadata as well in the url ```/FederationMetadata/2007-06/FederationMetadata.xml```.

## Usage

Options

| Name                | Description                                      | Default                                      |
| --------------------|:-------------------------------------------------| ---------------------------------------------|
| getPostURL| the function receives 4 parameters from the request (wtrealm, wreply, request, callback). It must return, via the calback, the URL to post the result response to | REQUIRED       
| getUserFromRequest| the function receives one parameter, the request. It must return the user being authenticated, as an object. This object will be passed to the profile mapper to determine attributes of the response. | `function(req){ return req.user; }`
| profileMapper| a ProfileMapper implementation to convert a user profile to claims  (PassportProfile)  | PassportProfileMapper
| cert| The public key / certificate of the issuer, in PEM format. | REQUIRED
| key| The private key of the issuer, used to sign the response, in PEM format.  | REQUIRED
| issuer| the name of the issuer of the response. | 
| audience| the name of the audience of the response. | 
| lifetime| The lifetime of the response, in seconds| 8 hours
| signatureAlgorithm| signature algorithm, options: rsa-sha1, rsa-sha256 | rsa-sha256
| digestAlgorithm| digest algorithm, options: sha1, sha256  | sha256
| jwt| if true, uses a JWT token for the signed assertion.  | false
| extendJWT| An object that, is passed, contains claims to be added to JWT signed assertion. | {}
| jwtAlgorithm| If using JWT signed assertion, indicates the algorithm to be applied | RS256
| jwtAllowInsecureKeySizes| Insecure and not recommended, for backward compatibility ONLY. If true, allows insecure key sizes to be used when signing with JWT| false
| jwtAllowInvalidAsymmetricKeyTypes| Insecure and not recommended, for backward compatibility ONLY. If true, allows a mismatch between JWT algorithm and the actual key type provided to sign. | false

Add the middleware as follows:

~~~javascript
app.get('/wsfed', wsfed.auth({
  issuer:     'the-issuer',
  cert:       fs.readFileSync(path.join(__dirname, 'some-cert.pem')),
  key:        fs.readFileSync(path.join(__dirname, 'some-cert.key')),
  getPostURL: function (wtrealm, wreply, req, callback) {
    return cb( null, 'http://someurl.com')
  }
}));
~~~~

## WsFederation Metadata

wsfed can generate the metadata document for wsfederation as well. Usage as follows:

~~~javascript
app.get('/wsfed/FederationMetadata/2007-06/FederationMetadata.xml', wsfed.metadata({
  issuer:   'the-issuer',
  cert:     fs.readFileSync(path.join(__dirname, 'some-cert.pem')),
}));
~~~

It also accept two optionals parameters:

-  profileMapper: a class implementing the profile mapper. This is used to render the claims type information (using the metadata property). See [PassportProfileMapper](https://github.com/auth0/node-wsfed/blob/master/lib/claims/PassportProfileMapper.js) for more information.
-  endpointPath: this is the full path in your server to the auth route. By default the metadata handler uses the metadata request route without ```/FederationMetadata/2007..blabla.```

## WsFederation Metadata endpoints ADFS1-like

ADFS v1 uses another set of endpoints for the metadata and the thumbprint. If you have to connect an ADFS v1 client you have to do something like this:

~~~javascript
app.get('/wsfed/adfs/fs/federationserverservice.asmx',
    wsfed.federationServerService.wsdl);

app.post('/wsfed/adfs/fs/federationserverservice.asmx',
    wsfed.federationServerService.thumbprint({
      pkcs7: yourPkcs7,
      cert:  yourCert
    }));
~~~

notice that you need a ```pkcs7``` with the full chain of all certificates. You can generate this with openssl as follows:

~~~bash
openssl crl2pkcs7 -nocrl \
    -certfile your.crt \
    -certfile another-cert-in-the-chain.crt \
    -out contoso1.p7b
~~~

## JWT

By default the signed assertion is a SAML token, you can use JWT tokens as follows:

~~~javascript
app.get('/wsfed', wsfed.auth({
  jwt:        true,
  issuer:     'the-issuer',
  key:        fs.readFileSync(path.join(__dirname, 'some-cert.key')),
  getPostUrl: function (wtrealm, wreply, req, callback) {
                return cb( null, 'http://someurl.com')
              }
}));
~~~~

Use the option `extendJWT` to add claims to the resulted token. `jwtAlgorithm` option allows to customize the algorithm used to sign tokens.  

Since version 7.0.0, restrictions apply on the signature of JWT tokens: 
- RSA key size must be 2048 bits or greater. (unless the not recommended and insecure option `jwtAllowInsecureKeySizes` is used)
- Asymmetric keys cannot be used to sign HMAC tokens.
- Key types must be valid for the signing algorithm (unless the not recommended and insecure option `jwtAllowInvalidAsymmetricKeyTypes` is used)

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
