import { Joi } from "express-validation";

const changeAdminValidation = {
    body: Joi.object({
        new_admin: Joi.string().trim().required(),
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

const addMembersToChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
    body: Joi.object({
        members: Joi.array().items(Joi.string().trim().required()).min(1).required(),
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

const updatePrivacyChatRoomValidation = {
    body: Joi.object({
        is_public: Joi.string().trim().required(),
    }),
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
};

const removeMembersFromChatRoomValidation = {
    params: Joi.object({
        chatRoomId: Joi.string().trim().required(),
    }),
    body: Joi.object({
        members: Joi.array().items(Joi.string().trim().required()).min(1).required(),
    }),
};

const createChatRoomForTwoPeopleValidation = {
    body: Joi.object({
        reciver: Joi.string().trim().required(),
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
    addMembersToChatRoomValidation,
    updateAvatarChatRoomValidation,
    updatePrivacyChatRoomValidation,
    removeMembersFromChatRoomValidation,
    createChatRoomForTwoPeopleValidation,
};
