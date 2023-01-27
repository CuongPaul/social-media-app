import Notification from "../models/Notification";

const createNotification = async ({ user, body }) => {
    const notification = new Notification({ user, body });

    const newNotification = await notification.save();

    return {
        body,
        id: newNotification.id,
        createdAt: notification.createdAt,
    };
};

export { createNotification };
