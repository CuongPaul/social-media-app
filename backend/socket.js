import redisClient from "./config/redis";

const socketServer = (io) => {
    io.on("connection", (socket) => {
        socket.on("client-connection", async ({ user_id }) => {
            await redisClient.RPUSH(`socket-io:${user_id}`, socket.id);
            await redisClient.expire(`socket-io:${user_id}`, 12 * 60 * 60);
        });

        socket.on("client-disconnect", async ({ user_id }) => {
            await redisClient.LREM(`socket-io:${user_id}`, 0, socket.id);
        });
    });
};

export default socketServer;
