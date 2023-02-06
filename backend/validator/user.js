import { Joi } from "express-validation";

const unfriendValidation = {
    params: Joi.object({
        friendId: Joi.string().required().trim(),
    }),
};

const getUserByIdValidation = {
    params: Joi.object({
        userId: Joi.string().required().trim(),
    }),
};

const searchUsersValidation = {
    query: Joi.object({
        name: Joi.string().required().trim(),
        page: Joi.number().integer().default(1).allow(null),
    }),
};

const deleteAccountValidation = {
    params: Joi.object({
        userId: Joi.string().required().trim(),
    }),
};

const updateProfileValidation = {
    body: Joi.object({
        name: Joi.string().allow(null).trim(),
        hometown: Joi.string().allow(null).trim(),
        education: Joi.string().allow(null).trim(),
    }),
};

const updatePasswordValidation = {
    body: Joi.object({
        new_password: Joi.string().required().trim(),
        current_password: Joi.string().required().trim(),
    }),
};

const updateCoverImageValidation = {
    body: Joi.object({
        cover_image: Joi.string().required().trim(),
    }),
};

const getRecommendUsersValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
};

const updateAvatarImageValidation = {
    body: Joi.object({
        avatar_image: Joi.string().required().trim(),
    }),
};

export {
    unfriendValidation,
    getUserByIdValidation,
    searchUsersValidation,
    deleteAccountValidation,
    updateProfileValidation,
    updatePasswordValidation,
    updateCoverImageValidation,
    getRecommendUsersValidation,
    updateAvatarImageValidation,
};
