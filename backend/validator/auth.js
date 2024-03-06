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

const signoutValidation = {
  body: Joi.object({
    socket_id: Joi.string().trim().required(),
    friends_online: Joi.array()
      .items(
        Joi.object({
          _id: Joi.string().trim().required(),
          name: Joi.string().trim().required(),
          avatar_image: Joi.string().allow("", null),
          sockets: Joi.array().items(Joi.string().trim().required()).required(),
        })
      )
      .required(),
  }),
};

export { signinValidation, signupValidation, signoutValidation };
