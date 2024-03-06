import { Joi } from "express-validation";

const getPostValidation = {
  params: Joi.object({
    postId: Joi.string().trim().required(),
  }),
};

const reactPostValidation = {
  params: Joi.object({
    postId: Joi.string().trim().required(),
  }),
  query: Joi.object({
    key: Joi.string()
      .required()
      .valid("sad", "wow", "like", "love", "haha", "angry"),
  }),
};

const removeTagValidation = {
  params: Joi.object({
    postId: Joi.string().trim().required(),
  }),
};

const createPostValidation = Joi.object({
  images: Joi.any().strip(),
  text: Joi.string().trim().required(),
  privacy: Joi.string().valid("FRIEND", "PUBLIC", "ONLY_ME"),
  body: Joi.string()
    .allow(null)
    .custom((value, helpers) => {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      } catch (error) {
        return helpers.error("any.invalid");
      }
    }),
}).custom((value, helpers) => {
  const { error } = Joi.object({
    location: Joi.string().allow("", null).trim(),
    feelings: Joi.string().allow("", null).trim(),
    tag_friends: Joi.array().items(Joi.string().trim()).allow(null),
  }).validate(value.body);

  if (error) {
    return helpers.error("any.invalid");
  }

  return value;
});

const deletePostValidation = {
  params: Joi.object({
    postId: Joi.string().trim().required(),
  }),
};

const updatePostValidation = Joi.object({
  images: Joi.any().strip(),
  text: Joi.string().trim().required(),
  old_images: Joi.string()
    .allow(null)
    .custom((value, helpers) => {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      } catch (error) {
        return helpers.error("any.invalid");
      }
    }),
  privacy: Joi.string().valid("FRIEND", "PUBLIC", "ONLY_ME"),
  body: Joi.string()
    .allow(null)
    .custom((value, helpers) => {
      try {
        const parsedValue = JSON.parse(value);
        return parsedValue;
      } catch (error) {
        return helpers.error("any.invalid");
      }
    }),
}).custom((value, helpers) => {
  const { error: errorOldImages } = Joi.array()
    .items(Joi.string().trim())
    .validate(value.old_images);

  const { error: errorBody } = Joi.object({
    location: Joi.string().allow("", null).trim(),
    feelings: Joi.string().allow("", null).trim(),
    tag_friends: Joi.array().items(Joi.string().trim()).allow(null),
  }).validate(value.body);

  if (errorBody || errorOldImages) {
    return helpers.error("any.invalid");
  }

  return value;
});

const getAllPostsValidation = {
  query: Joi.object({
    page: Joi.number().integer().allow(null),
  }),
};

const getPostsByUserValidation = {
  query: Joi.object({
    page: Joi.number().integer().allow(null),
  }),
  params: Joi.object({
    userId: Joi.string().trim().required(),
  }),
};

export {
  getPostValidation,
  reactPostValidation,
  removeTagValidation,
  createPostValidation,
  deletePostValidation,
  updatePostValidation,
  getAllPostsValidation,
  getPostsByUserValidation,
};
