import { Joi } from "express-validation";

const changeAdminValidation = {
    body: Joi.object({
        member: Joi.string().trim().required(),
    }),
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const joinChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const leaveChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const createChatRoomValidation = {
    body: Joi.object({
        is_public: Joi.boolean().allow(null),
        name: Joi.string().trim().required(),
        avatar_image: Joi.string().trim().allow(null),
        members: Joi.array().items(Joi.string().trim().required()).min(2).required(),
    }),
};

const deleteChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const searchChatRoomsValidation = {
    query: Joi.object({
        name: Joi.string().trim().required(),
        page: Joi.number().integer().allow(null),
    }),
};

const updateNameChatRoomValidation = {
    body: Joi.object({
        name: Joi.string().trim().required(),
    }),
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const updateAvatarChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
    body: Joi.object({
        avatar_image: Joi.string().trim().required(),
    }),
};

const updateMemberChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
    body: Joi.object({
        members: Joi.array().items(Joi.string().trim().required()).min(1).required(),
    }),
};

const updatePrivacyChatRoomValidation = {
    body: Joi.object({
        is_public: Joi.string().trim().required(),
    }),
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

export {
    changeAdminValidation,
    joinChatRoomValidation,
    leaveChatRoomValidation,
    createChatRoomValidation,
    deleteChatRoomValidation,
    searchChatRoomsValidation,
    updateNameChatRoomValidation,
    updateAvatarChatRoomValidation,
    updateMemberChatRoomValidation,
    updatePrivacyChatRoomValidation,
};
