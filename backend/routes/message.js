import express from "express";

import {
    sendMessage,
    getMessages,
    reactMessage,
    deleteMessage,
    updateMessages,
} from "../controllers/message";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/:roomId", verifyToken, getMessages);
router.post("/:roomId", verifyToken, sendMessage);
router.put("/:meassageId", verifyToken, updateMessages);
router.delete("/:meassageId", verifyToken, deleteMessage);
router.post("/react-message/:messageId", verifyToken, reactMessage);

export default router;
