const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


module.exports.getAthletesByOrganizationSchema = {
  body: {},
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.addAthleteForOrganizationSchema = {
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    passcode: Joi.number().required(),
    sport: Joi.string().required().valid(['Football', 'Baseball', 'Wrestling']),
  },
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.updateAthleteSchema = {
  body: {
    firstName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.string().valid('Male', 'Female'),
    birthday: Joi.date(),
    sport: Joi.string().valid(['Football', 'Baseball', 'Wrestling']),
    showWeight: Joi.boolean(),
    highRisk: Joi.boolean(),
    passcode: Joi.number(),
    fingerprint: Joi.number(),
    bodyFat: Joi.number(),
  },
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};


module.exports.deleteAthletesByOrganizationSchema = {
  body: {},
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.deleteAthleteSchema = {
  body: {},
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};


module.exports.getAthleteWeightsSchema = {
  body: {},
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};
