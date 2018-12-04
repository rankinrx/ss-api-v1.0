const Joi = require('joi');

module.exports.signupSchema = {
  body: {
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().trim().required(),
    profile: Joi.object().keys({
      firstName: Joi.string().allow(''),
      lastName: Joi.string().allow(''),
      location: Joi.string().allow(''),
    }),
  },
  params: {},
  query: {},
};


module.exports.loginSchema = {
  body: {
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().trim().required(),
  },
  params: {},
  query: {},
};


module.exports.forgotPasswordSchema = {
  body: {
    email: Joi.string().trim().email({ minDomainAtoms: 2 }).required(),
  },
  params: {},
  query: {},
};


module.exports.resetPasswordSchema = {
  body: {
    password: Joi.string().trim().required(),
  },
  params: {
    token: Joi.string().required(),
  },
  query: {},
};
