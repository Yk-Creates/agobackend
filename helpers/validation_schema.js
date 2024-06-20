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


export const driverSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  carNumber: Joi.string().required(),
  drivingLicense: Joi.string().required(),
  aadhaarCard: Joi.string().required(),
  employmentType: Joi.string().valid(...Object.values(employmentTypes)).required(),
  carType: Joi.string().valid(...Object.values(carTypes)).required(),
  carModel: Joi.string().required(),
  carYear: Joi.number().integer().min(1886).required(),
  status: Joi.boolean().required(),
});
