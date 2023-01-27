import User from "../models/User";

import { createNotification } from "./notification";

const sendNotification = async ({ req, key, data, notif_body }) => {
    const user = await User.findById(req.user_id).populate("friends");

    user.friends.forEach(async (friend) => {
        if (friend.socket_id) {
            req.io.to(friend.socket_id).emit(key, { data }); // Add new post realtime to newsfeed friend

            if (notif_body) {
                const notification = await createNotification({
                    user: friend._id,
                    body: notif_body,
                });
                req.io.to(friend.socket_id).emit("notification", { data: notification }); // Push notification realtime to friend
            }
        }
    });
};

export { sendNotification };
