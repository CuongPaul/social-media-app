import express from "express";

import AuthRoutes from "./auth";
import PostRoutes from "./post";
import UserRoutes from "./user";
import UploadRoutes from "./upload";
import CommentRoutes from "./comment";
import MessageRoutes from "./message";
import ChatRoomRoutes from "./chat-room";
import NotificationRoutes from "./notification";
import FriendRequestRoutes from "./friend-request";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/post", PostRoutes);
router.use("/user", UserRoutes);
router.use("/upload", UploadRoutes);
router.use("/comment", CommentRoutes);
router.use("/message", MessageRoutes);
router.use("/chat-room", ChatRoomRoutes);
router.use("/notification", NotificationRoutes);
router.use("/friend-request", FriendRequestRoutes);

export default router;
