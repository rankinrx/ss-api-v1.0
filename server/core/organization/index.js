const httpStatus = require('http-status');
const Organization = require('./model');
const APIError = require('../../helpers/APIError');


module.exports.findOrganizationById = async function findOrganizationById(organizationId) {
  const organization = await Organization.findOne({ _id: organizationId });
  if (!organization) throw new APIError('Organization not found', httpStatus.NOT_FOUND, true);
  return organization;
};


module.exports.findOrganizationsByUser = async function findOrganizationsByUser(user) {
  if (user.profile.role === 'admin') return Organization.find({});
  return Organization.find({ users: user._id });
};


module.exports.addOrganization = async function addOrganization(organizationData) {
  const organization = new Organization(organizationData);
  return organization.save();
};


module.exports.updateOrganization = async function updateOrganization(organizationId, organizationData, userRole) {
  let availableFields = ['iiMessage', 'ioMessage', 'iiPercent', 'ioPercent'];
  if (userRole === 'admin') availableFields = ['name', 'subscription', 'users', ...availableFields];

  const bodyKeys = Object.keys(organizationData);
  bodyKeys.forEach((key) => {
    if (availableFields.indexOf(key) === -1) delete organizationData[key];
  });

  const organization = await Organization.findByIdAndUpdate(organizationId, { $set: organizationData }, { new: true });
  if (!organization) throw new APIError('Organization not found', httpStatus.NOT_FOUND, true);
  return organization;
};
