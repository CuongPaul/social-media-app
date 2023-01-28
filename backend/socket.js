import User from "./models/User";

const socketServer = (io) => {
    io.on("connection", async (socket) => {
        if (io.req) {
            const userId = io.req.user_id;

            socket.broadcast.emit("user-online", { user_id: userId });

            await User.findByIdAndUpdate(userId, { $push: { socket_id: socket.id } });

            socket.on("disconnect", async () => {
                const user = await User.findByIdAndUpdate(userId, {
                    $pull: { socket_id: socket.id },
                });

                if (user.socket_id.length === 0) {
                    socket.broadcast.emit("user-offline", { user_id: userId });
                }
            });
        }
    });
};

export default socketServer;
