import User from "./models/User";

const socketServer = (io) => {
    io.on("connection", async (socket) => {
        if (io.req) {
            const userId = io.req.user_id;

            socket.broadcast.emit("friend-login-status", { user_id: userId });

            await User.findByIdAndUpdate(userId, { socket_id: socket.id });

            socket.on("disconnect", () => {
                socket.broadcast.emit("friend-logout-status", { user_id: userId });
                io.req.user_id = null;
            });
        }
    });
};

export default socketServer;
