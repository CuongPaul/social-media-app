import { Joi } from "express-validation";

const readNotificationValidation = {
    params: Joi.object({
        notificationId: Joi.string().required().trim(),
    }),
};

const getNotificationsValidation = {
    query: Joi.object({
        page: Joi.number().integer().default(1).allow(null),
    }),
};

export { readNotificationValidation, getNotificationsValidation };
