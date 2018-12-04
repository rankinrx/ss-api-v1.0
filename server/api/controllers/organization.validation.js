const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


module.exports.getOrganizationsSchema = {
  body: {},
  params: {},
  query: {},
};


module.exports.addOrganizationSchema = {
  body: {
    name: Joi.string(),
    subscription: Joi.string().valid(['Standard', 'Premium']),
    iiMessage: Joi.string(),
    ioMessage: Joi.string(),
    iiPercent: Joi.number(),
    ioPercent: Joi.number(),
  },
  params: {},
  query: {},
};


module.exports.getOrganizationSchema = {
  body: {},
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};


module.exports.updateOrganizationSchema = {
  body: {
    name: Joi.string(),
    subscription: Joi.string().valid(['Standard', 'Premium']),
    users: Joi.array().items(Joi.objectId()),
    iiMessage: Joi.string(),
    ioMessage: Joi.string(),
    iiPercent: Joi.number(),
    ioPercent: Joi.number(),

  },
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};
