const Joi = require('joi');

module.exports.postContactFormSchema = {
  body: {
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    name: Joi.string().required(),
    message: Joi.string(),
  },
  params: {},
  query: {},
};
