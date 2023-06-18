import { Notification } from "../models";

const readNotificationController = async (req, res) => {
    const userId = req.user_id;
    const { notificationId } = req.params;

    try {
        const notification = await Notification.findOne({ user: userId, _id: notificationId });

        if (!notification) {
            res.status(200).json({ message: "Notification doesn't exist" });
        }

        await notification.updateOne({ is_read: true });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getNotificationsController = async (req, res) => {
    const pageSize = 10;
    const userId = req.user_id;
    const page = parseInt(req.query.page) || 1;

    try {
        const query = { user: userId };

        const notifications = await Notification.find(query)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .populate("chat_room", { createdAt: 0, updatedAt: 0 });

        const count = await Notification.countDocuments(query);

        return res.status(200).json({ message: "success", data: { count, rows: notifications } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const readAllNotificationController = async (req, res) => {
    const userId = req.user_id;

    try {
        await Notification.updateMany({ user: userId, is_read: false }, { is_read: true });

        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export { readNotificationController, getNotificationsController, readAllNotificationController };
