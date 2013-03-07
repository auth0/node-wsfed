var templates = require('./templates');
var thumbprint = require('thumbprint');
var URL_PATH = '/wsfed/adfs/fs/federationserverservice.asmx';

function getLocation (req) {
  var protocol = req.headers['x-iisnode-https'] && req.headers['x-iisnode-https'] == 'ON' ? 
                 'https' : 
                 (req.headers['x-forwarded-proto'] || req.protocol);
  
  return protocol + '://' + req.headers['host'] + req.originalUrl;
}

function certToPem (cert) {
  var pem = /-----BEGIN CERTIFICATE-----([^-]*)-----END CERTIFICATE-----/g.exec(cert.toString());
  if (pem.length > 0) {
    return pem[1].replace(/[\n|\r\n]/g, '');
  }
  return null;
}


function getEndpointAddress (req, endpointPath) {
  endpointPath = endpointPath || 
    (req.originalUrl.substr(0, req.originalUrl.length - URL_PATH.length));

  var protocol = req.headers['x-iisnode-https'] && req.headers['x-iisnode-https'] == 'ON' ? 
                 'https' : 
                 (req.headers['x-forwarded-proto'] || req.protocol);
  
  return protocol + '://' + req.headers['host'] + endpointPath;
}


module.exports.wsdl = function (req, res) {
  res.set('Content-Type', 'text/xml; charset=UTF-8');
  if(req.query.wsdl){
    return res.send(templates.federationServerServiceWsdl());
  }
  res.send(templates.federationServerService({
    location: getLocation(req)
  }));
};

module.exports.thumbprint = function (options) {
  var cert = new Buffer(options.cert).toString('base64');
  var tp = thumbprint.calculate(certToPem(options.cert));

  return function (req, res) {
    res.send(templates.federationServerServiceResponse({
      location: getEndpointAddress(req, options.endpointPath),
      cert: cert,
      thumbprint: tp
    }));
  };
};