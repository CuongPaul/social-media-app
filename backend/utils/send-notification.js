import User from "../models/User";
import Notification from "../models/Notification";
import { notificationDataFilter } from "./filter-data";

const sendNotification = async ({ key, req, content }) => {
    const user = await User.findById(req.user_id).populate("friends");

    for (let i = 0; i < user.friends.length; i++) {
        const friend = user.friends[i];

        if (!user.block_user_notification.includes(friend.id)) {
            const newNotification = new Notification({ key, content, user: friend.id });
            const saveNotification = await newNotification.save();

            if (friend.socket_id.length) {
                for (let j = 0; j < friend.socket_id.length; j++) {
                    req.io
                        .to(friend.socket_id[j])
                        .emit(key, { data: notificationDataFilter(saveNotification) });
                }
            }
        }
    }
};

export { sendNotification };
