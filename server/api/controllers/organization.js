const httpStatus = require('http-status');
const Organization = require('../../core/organization');
const APIError = require('../../helpers/APIError');


module.exports.getOrganizationsRoute = async function getOrganizationsRoute(req, res, next) {
  try {
    const organizations = await Organization.findOrganizationsByUser(req.user);
    return res.json({ data: organizations });
  } catch (error) {
    return next(error);
  }
};


module.exports.addOrganizationRoute = async function addOrganizationRoute(req, res, next) {
  try {
    if (req.user.profile.role === 'admin') { throw new APIError('Only admins can add organizations', httpStatus.UNAUTHORIZED, true); }

    const newOrg = await Organization.addOrganization(req.body);
    return res.json({ data: newOrg });
  } catch (error) {
    return next(error);
  }
};


module.exports.getOrganizationRoute = async function getOrganizationRoute(req, res, next) {
  try {
    const organization = await Organization.findOrganizationById(req.params.id);
        // if (organization.users && organization.users.indexOf(req.user.id) === -1)
        //     throw new APIError('Organization not found', httpStatus.NOT_FOUND, true);

    return res.json({ data: organization });
  } catch (error) {
    return next(error);
  }
};


module.exports.updateOrganizationRoute = async function updateOrganizationRoute(req, res, next) {
  try {
    const updatedOrg = await Organization.updateOrganization(req.params.id, req.body, req.user.profile.role);
    return res.json({ data: updatedOrg });
  } catch (error) {
    return next(error);
  }
};
