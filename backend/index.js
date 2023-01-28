import cors from "cors";
import express from "express";
import Server from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createServer } from "http";

import socketServer from "./socket";
import AuthRoutes from "./routes/auth";
import PostRoutes from "./routes/post";
import UserRoutes from "./routes/user";
import CommentRoutes from "./routes/comment";
import MessageRoutes from "./routes/message";
import ChatRoomRoutes from "./routes/chat-room";
import NotificationRoutes from "./routes/notification";
import FriendRequestRoutes from "./routes/friend-request";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/facebook-clone";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
socketServer(io);

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
    io.req = req;
    req.io = io;

    next();
});

app.use("/api/auth", AuthRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/comment", CommentRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/chat-room", ChatRoomRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/friend-request", FriendRequestRoutes);

mongoose
    .connect(MONGODB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
    .catch((err) => console.log(err));
