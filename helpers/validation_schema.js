import Joi from "joi";

// Joi schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().required(),
  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits long",
    }),
  password: Joi.string().required(),
});

// Joi schema for user login
export const loginSchema = Joi.object({
  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits long",
    }),
  password: Joi.string().required(),
});
