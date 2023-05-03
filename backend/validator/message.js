import { Joi } from "express-validation";

const getMessagesValidatetion = {
    query: Joi.object({
        page: Joi.number().integer().allow(null),
    }),
    params: Joi.object({
        chatRoomId: Joi.string().required().trim(),
    }),
};

const reactMessageValidatetion = {
    params: Joi.object({
        messageId: Joi.string().required().trim(),
    }),
    query: Joi.object({
        chat_room_id: Joi.string().required().trim(),
        key: Joi.string().required().valid("wow", "sad", "like", "love", "haha", "angry"),
    }),
};

const createMessageValidatetion = {
    body: Joi.object({
        text: Joi.string().required().trim(),
        image: Joi.string().allow(null).trim(),
        chat_room_id: Joi.string().required().trim(),
    }),
};

const deleteMessageValidatetion = {
    params: Joi.object({
        meassageId: Joi.string().required().trim(),
    }),
    query: Joi.object({
        chat_room_id: Joi.string().required().trim(),
    }),
};

const updateMessagesValidatetion = {
    body: Joi.object({
        text: Joi.string().required().trim(),
        image: Joi.string().allow(null).trim(),
        chat_room_id: Joi.string().required().trim(),
    }),
    params: Joi.object({
        meassageId: Joi.string().required().trim(),
    }),
};

export {
    getMessagesValidatetion,
    reactMessageValidatetion,
    createMessageValidatetion,
    deleteMessageValidatetion,
    updateMessagesValidatetion,
};
