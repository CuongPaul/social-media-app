import { Joi } from "express-validation";

const reactCommentValidation = {
    params: Joi.object({
        commentId: Joi.string().trim().required(),
    }),
    query: Joi.object({
        key: Joi.string().valid("sad", "wow", "like", "love", "haha", "angry").required(),
    }),
};

const createCommentValidation = {
    body: Joi.object({
        text: Joi.string().trim().required(),
        image: Joi.string().allow(null).trim(),
        post_id: Joi.string().trim().required(),
    }),
};

const deleteCommentValidation = {
    params: Joi.object({
        commentId: Joi.string().trim().required(),
    }),
};

const updateCommentValidation = {
    body: Joi.object({
        text: Joi.string().trim().required(),
        image: Joi.string().allow(null).trim(),
    }),
    params: Joi.object({
        commentId: Joi.string().trim().required(),
    }),
};

const getCommentsByPostValidation = {
    query: Joi.object({
        post_id: Joi.string().trim().required(),
        page: Joi.number().integer().allow(null),
    }),
};

export {
    reactCommentValidation,
    createCommentValidation,
    deleteCommentValidation,
    updateCommentValidation,
    getCommentsByPostValidation,
};
