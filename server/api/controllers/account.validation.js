const Joi = require('joi');


module.exports.getAccountSchema = {
  body: {},
  params: {},
  query: {},
};


module.exports.updateAccountSchema = {
  body: {
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().trim(),
    profile: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      location: Joi.string(),
    }),
  },
  params: {},
  query: {},
};
