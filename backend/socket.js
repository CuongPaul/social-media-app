const socketServer = (io) => {
    io.on("connection", (socket) => {
        if (io.req) {
            const userId = io.req.user_id;

            socket.broadcast.emit("friend-online", { user_id: userId });

            socket.on("disconnect", () => {
                socket.broadcast.emit("friend-offline", { user_id: userId });
            });
        }
    });
};

export default socketServer;
