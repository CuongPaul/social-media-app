import cors from "cors";
import express from "express";
import Server from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { createServer } from "http";
import bodyParser from "body-parser";
import { ValidationError } from "express-validation";

import socketServer from "./socket";
import AuthRoutes from "./routes/auth";
import PostRoutes from "./routes/post";
import UserRoutes from "./routes/user";
import UploadRoutes from "./routes/upload";
import CommentRoutes from "./routes/comment";
import MessageRoutes from "./routes/message";
import ChatRoomRoutes from "./routes/chat-room";
import NotificationRoutes from "./routes/notification";
import FriendRequestRoutes from "./routes/friend-request";

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
socketServer(io);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, _res, next) => {
    req.io = io;
    next();
});

app.use("/auth", AuthRoutes);
app.use("/post", PostRoutes);
app.use("/user", UserRoutes);
app.use("/upload", UploadRoutes);
app.use("/comment", CommentRoutes);
app.use("/message", MessageRoutes);
app.use("/chat-room", ChatRoomRoutes);
app.use("/notification", NotificationRoutes);
app.use("/friend-request", FriendRequestRoutes);

app.use((err, _req, res, _next) => {
    if (err instanceof ValidationError) {
        const { params, query, body } = err.details;
        if (params || query || body) {
            return res.status(err.statusCode).json({
                message: params ? params[0].message : query ? query[0].message : body[0].message,
            });
        }
        return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
});

mongoose
    .connect(MONGODB_URI)
    .then(() => httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`)))
    .catch((err) => console.log(err));
