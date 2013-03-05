//shorthands claims namespaces
var fm = {
  'nameidentifier': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'email': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  'name': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  'givenname': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
  'surname': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
  'upn': 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
  'groups': 'http://schemas.xmlsoap.org/claims/Group'
};

/**
 *
 * Passport User Profile Mapper
 *
 * A class to map passport.js user profile to a wsfed claims based identity.
 *
 * Passport Profile:
 * http://passportjs.org/guide/profile/
 * 
 * Claim Types:
 * http://msdn.microsoft.com/en-us/library/microsoft.identitymodel.claims.claimtypes_members.aspx
 */
function PassportProfileMapper () {
  if(!(this instanceof PassportProfileMapper)) {
    return new PassportProfileMapper();
  }
}

/**
 * map passport.js user profile to a wsfed claims based identity.
 * 
 * @param  {Object} pu Passport.js profile
 * @return {[type]}    WsFederation claim identity
 */
PassportProfileMapper.prototype.map = function (pu) {
  var claims = {};

  claims[fm.nameidentifier]  = pu.id;
  claims[fm.email]      = pu.emails[0] && pu.emails[0].value;
  claims[fm.name]       = pu.displayName;
  claims[fm.givenname]  = pu.name.givenName;
  claims[fm.surname]    = pu.name.familyName;
  
  return claims;
};

/**
 * claims metadata used in the metadata endpoint.
 * 
 * @param  {Object} pu Passport.js profile
 * @return {[type]}    WsFederation claim identity
 */
PassportProfileMapper.prototype.metadata = [ {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  optional: true,
  displayName: 'E-Mail Address',
  description: 'The e-mail address of the user'
}, {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
  optional: true,
  displayName: 'Given Name',
  description: 'The given name of the user'
}, {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  optional: true,
  displayName: 'Name',
  description: 'The unique name of the user'
}, {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
  optional: true,
  displayName: 'Surname',
  description: 'The surname of the user'
}, {
  id: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  optional: true,
  displayName: 'Name ID',
  description: 'The SAML name identifier of the user'
}];

module.exports = PassportProfileMapper;