const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


module.exports.getDevicesByOrganizationSchema = {
  body: {},
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.addDeviceForOrganizationSchema = {
  body: {},
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.recordWeightSchema = {
  body: {
    operation: Joi.string().required().valid(['io', 'save']),
    authType: Joi.string().required().valid(['fingerprint', 'passcode']),
    authId: Joi.number().required(),
    wt: Joi.number().required(),
  },
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};
