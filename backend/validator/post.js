import { Joi } from "express-validation";

const reactPostValidation = {
    params: Joi.object({
        postId: Joi.string().trim().required(),
    }),
    query: Joi.object({
        key: Joi.string().required().valid("wow", "sad", "like", "love", "haha", "angry"),
    }),
};

const createPostValidation = {
    body: Joi.object({
        text: Joi.string().trim().required(),
        images: Joi.array().items(Joi.string().trim().required()).allow(null),
        privacy: Joi.string().valid("FRIEND", "PUBLIC", "ONLY_ME").required(),
        body: Joi.object({
            location: Joi.string().allow(null).trim(),
            feelings: Joi.string().allow(null).trim(),
            tag_friends: Joi.array().items(Joi.string().trim().required()).min(1).allow(null),
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
        images: Joi.array().items(Joi.string().trim().required()).allow(null),
        privacy: Joi.string().required().valid("FRIEND", "PUBLIC", "ONLY_ME"),
        body: Joi.object({
            location: Joi.string().allow(null).trim(),
            feelings: Joi.string().allow(null).trim(),
            tag_friends: Joi.array().items(Joi.string().trim().required()).min(1).allow(null),
        }).allow(null),
    }),
    params: Joi.object({
        postId: Joi.string().trim().required(),
    }),
};

const getAllPostsValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
};

const getPostsByUserValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
    params: Joi.object({
        userId: Joi.string().trim().required(),
    }),
};

export {
    reactPostValidation,
    createPostValidation,
    deletePostValidation,
    updatePostValidation,
    getAllPostsValidation,
    getPostsByUserValidation,
};
