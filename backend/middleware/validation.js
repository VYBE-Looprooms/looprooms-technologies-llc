const Joi = require('joi');

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 128 characters',
    'string.pattern.base': 'Password must include at least one letter and one number',
  });

const validateWaitlistSubmission = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s\-']+$/)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must not exceed 50 characters',
        'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
        'any.required': 'First name is required',
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s\-']+$/)
      .optional()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must not exceed 50 characters',
        'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateEmailRequest = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must not exceed 50 characters',
        'any.required': 'First name is required',
      }),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateRegisterRequest = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s\-']+$/)
      .required()
      .messages({
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must not exceed 50 characters',
        'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes',
        'any.required': 'First name is required',
      }),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s\-']+$/)
      .required()
      .messages({
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must not exceed 50 characters',
        'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes',
        'any.required': 'Last name is required',
      }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: passwordSchema.required(),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateLoginRequest = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateWaitlistSubmission,
  validateEmailRequest,
  validateRegisterRequest,
  validateLoginRequest,
};
