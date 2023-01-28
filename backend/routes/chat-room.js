import express from "express";
import {
    joinChatRoom,
    leaveChatRoom,
    createChatRoom,
    deleteChatRoom,
    searchChatRoom,
    getChatRoomsByUser,
    updateNameChatRoom,
    addMembersToChatRoom,
    updateAvatarChatRoom,
    removeMemberChatRoom,
} from "../controllers/chat-room";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.post("/", verifyToken, createChatRoom);
router.get("/", verifyToken, getChatRoomsByUser);
router.get("/search", verifyToken, searchChatRoom);
router.put("/join-chat/:chatRoomId", verifyToken, joinChatRoom);
router.put("/leave-chat/:chatRoomId", verifyToken, leaveChatRoom);

router.delete("/:chatRoomId", verifyToken, deleteChatRoom);
router.put("/update-name/:chatRoomId", verifyToken, updateNameChatRoom);
router.put("/add-member/:chatRoomId", verifyToken, addMembersToChatRoom);
router.put("/update-avatar/:chatRoomId", verifyToken, updateAvatarChatRoom);
router.put("/remove-member/:chatRoomId", verifyToken, removeMemberChatRoom);

export default router;
