import { Joi } from "express-validation";

const signinValidation = {
    body: Joi.object({
        password: Joi.string().trim().required(),
        email: Joi.string().email().trim().required(),
    }),
};

const signupValidation = {
    body: Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().email().trim().required(),
        password: Joi.string().min(4).max(16).trim().required(),
    }),
};

export { signinValidation, signupValidation };
