import redisClient from "./config/redis";

const getAllOnlineUsers = async () => {
    const usersOnline = [];
    const prefixKey = "socket-io:";

    const redisKeys = await redisClient.KEYS(`${prefixKey}*`);

    for (const item of redisKeys) {
        const sockets_id = await redisClient.LRANGE(item, 0, -1);
        const user_id = item.slice(prefixKey.length, item.length);

        usersOnline.push({ user_id, sockets_id });
    }

    return usersOnline;
};

const socketServer = (io) => {
    io.on("connection", (socket) => {
        socket.on("client-connection", async ({ _id, name, avatar_image }) => {
            const sockets = await redisClient.LRANGE(`socket-io:${_id}`, 0, -1);
            if (!sockets.length) {
                io.emit("user-online", { _id, name, avatar_image });
            }

            await redisClient.RPUSH(`socket-io:${_id}`, socket.id);
            await redisClient.expire(`socket-io:${_id}`, 12 * 60 * 60);
        });

        socket.on("client-disconnect", async ({ user_id }) => {
            await redisClient.LREM(`socket-io:${user_id}`, 0, socket.id);

            const sockets = await redisClient.LRANGE(`socket-io:${user_id}`, 0, -1);
            if (!sockets.length) {
                io.emit("user-offline", user_id);
            }
        });
    });
};

export default socketServer;
