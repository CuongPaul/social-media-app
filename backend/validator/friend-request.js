import { Joi } from "express-validation";

const sendFriendRequestValidation = {
    params: Joi.object({
        receiverId: Joi.string().trim().required(),
    }),
};

const acceptFriendRequestValidation = {
    params: Joi.object({
        friendRequestId: Joi.string().trim().required(),
    }),
};

const declineOrCancelRequestValidation = {
    params: Joi.object({
        friendRequestId: Joi.string().trim().required(),
    }),
};

const getSendedFriendRequestsValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
};

const getReceivedFriendRequestsValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
};

export {
    sendFriendRequestValidation,
    acceptFriendRequestValidation,
    declineOrCancelRequestValidation,
    getSendedFriendRequestsValidation,
    getReceivedFriendRequestsValidation,
};
