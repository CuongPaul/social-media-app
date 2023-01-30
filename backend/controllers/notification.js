import Notification from "../models/Notification";
import { notificationDataFilter } from "../utils/filter-data";

const getNotificationsByUser = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user_id });

        if (!notifications.length) {
            res.status(200).json({ message: "You don't have notification" });
        }

        const notificationsData = notifications.map((notification) =>
            notificationDataFilter(notification)
        );

        res.status(200).json({
            data: notificationsData,
            message: "Successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const readNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);

        if (!notification) {
            res.status(200).json({ message: "Notification doesn't exist" });
        }

        notification.is_read = true;
        notification.save();

        res.status(200).json({ message: "uccessfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const readAllNotification = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user_id, is_read: false }, { is_read: true });

        res.status(200).json({ message: "Successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getNotificationsByKey = async (req, res) => {
    try {
        const notifications = await Notification.find({ key: req.params.key, user: req.user_id });

        if (!notifications.length) {
            res.status(200).json({ message: "You don't have any notifications" });
        }

        const notificationsData = notifications.map((notification) =>
            notificationDataFilter(notification)
        );

        res.status(200).json({
            data: notificationsData,
            message: "Successfully",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

export { readNotification, readAllNotification, getNotificationsByKey, getNotificationsByUser };
