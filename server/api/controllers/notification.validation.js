const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


module.exports.getNotificationsByOrganizationSchema = {
  body: {},
  params: {},
  query: {
    currentOrg: Joi.objectId().required(),
  },
};


module.exports.deleteNotificationSchema = {
  body: {},
  params: {
    id: Joi.objectId().required(),
  },
  query: {},
};
