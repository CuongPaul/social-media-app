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
        key: Joi.string().required().valid("sad", "wow", "like", "love", "haha", "angry"),
    }),
};

const createPostValidation = {
    body: Joi.object({
        text: Joi.string().trim().required(),
        privacy: Joi.string().valid("FRIEND", "PUBLIC", "ONLY_ME"),
        images: Joi.array().items(Joi.string().trim().required()).allow(null),
        body: Joi.object({
            location: Joi.string().allow("", null).trim(),
            feelings: Joi.string().allow("", null).trim(),
            tag_friends: Joi.array().items(Joi.string().trim()).allow(null),
        }).allow(null),
    }),
};

const deletePostValidation = {
    params: Joi.object({
        postId: Joi.string().trim().required(),
    }),
};

const updatePostValidation = {
    body: Joi.object({
        text: Joi.string().trim().required(),
        privacy: Joi.string().valid("FRIEND", "PUBLIC", "ONLY_ME"),
        images: Joi.array().items(Joi.string().trim().required()).allow(null),
        body: Joi.object({
            location: Joi.string().allow("", null).trim(),
            feelings: Joi.string().allow("", null).trim(),
            tag_friends: Joi.array().items(Joi.string().trim()).allow(null),
        }).allow(null),
    }),
    params: Joi.object({
        postId: Joi.string().trim().required(),
    }),
};

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
    createPostValidation,
    deletePostValidation,
    updatePostValidation,
    getAllPostsValidation,
    getPostsByUserValidation,
};
