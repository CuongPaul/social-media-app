import { Joi } from "express-validation";

const sendFriendRequestValidation = {
  body: Joi.object({
    receiver_id: Joi.string().trim().required(),
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
    page: Joi.number().integer().allow(null),
  }),
};

const getReceivedFriendRequestsValidation = {
  query: Joi.object({
    page: Joi.number().integer().allow(null),
  }),
};

export {
  sendFriendRequestValidation,
  acceptFriendRequestValidation,
  declineOrCancelRequestValidation,
  getSendedFriendRequestsValidation,
  getReceivedFriendRequestsValidation,
};
