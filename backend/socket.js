import redisClient from "./helpers/redis";

// const getAllOnlineUsers = async () => {
//     const usersOnline = [];
//     const prefixKey = "socket-io:";

//     const redisKeys = await redisClient.KEYS(`${prefixKey}*`);

//     for (const item of redisKeys) {
//         const sockets_id = await redisClient.LRANGE(item, 0, -1);
//         const user_id = item.slice(prefixKey.length, item.length);

//         usersOnline.push({ user_id, sockets_id });
//     }

//     return usersOnline;
// };

const socketServer = (io) => {
    io.on("connection", (socket) => {
        socket.on("client-connection", async ({ _id, name, avatar_image, friends_online }) => {
            if (friends_online.length) {
                const sockets = await redisClient.LRANGE(`socket-io:${_id}`, 0, -1);

                for (const friend of friends_online) {
                    for (const item of friend.sockets) {
                        if (sockets.length) {
                            io.to(item).emit("add-socket-for-user-online", {
                                _id,
                                socket: socket.id,
                            });
                        } else {
                            io.to(item).emit("user-online", {
                                _id,
                                name,
                                avatar_image,
                                sockets: [socket.id],
                            });
                        }
                    }
                }
            }

            await redisClient.RPUSH(`socket-io:${_id}`, socket.id);
            await redisClient.expire(`socket-io:${_id}`, 12 * 60 * 60);
        });

        socket.on("client-disconnect", async ({ _id, friends_online }) => {
            await redisClient.LREM(`socket-io:${_id}`, 0, socket.id);

            if (friends_online.length) {
                const sockets = await redisClient.LRANGE(`socket-io:${_id}`, 0, -1);

                if (!sockets.length) {
                    for (const friend of friends_online) {
                        for (const item of friend.sockets) {
                            io.to(item).emit("user-offline", _id);
                        }
                    }
                }
            }
        });

        socket.on("make-phone-call", async ({ sender, receiver_id }) => {
            const sockets = await redisClient.LRANGE(`socket-io:${receiver_id}`, 0, -1);

            for (const socketId of sockets) {
                io.to(socketId).emit("phone-call-incoming", sender);
            }
        });

        socket.on("answer-phone-call", async ({ called_by_user, receiver_signal_data }) => {
            const sockets = await redisClient.LRANGE(`socket-io:${called_by_user}`, 0, -1);

            for (const socketId of sockets) {
                io.to(socketId).emit("receiver-answer-phone-call", receiver_signal_data);
            }
        });
    });
};

export default socketServer;
