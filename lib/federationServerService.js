var templates = require('./templates');

function getLocation (req) {
  var protocol = req.headers['x-iisnode-https'] && req.headers['x-iisnode-https'] == 'ON' ? 
                 'https' : 
                 (req.headers['x-forwarded-proto'] || req.protocol);
  
  return protocol + '://' + req.headers['host'] + req.originalUrl;
}

module.exports = function (req, res) {
  res.set('Content-Type', 'text/xml; charset=UTF-8');
  if(req.query.wsdl){
    return res.send(templates.federationServerServiceWsdl());
  }
  res.send(templates.federationServerService({
    location: getLocation(req)
  }));
};