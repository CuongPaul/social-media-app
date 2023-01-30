import express from "express";

import {
    unfriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineOrCancelRequest,
    getSendedFriendRequests,
    getReceivedFriendRequests,
} from "../controllers/friend-request";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put("/unfriend/:friendId", verifyToken, unfriend);

router.get("/sended", verifyToken, getSendedFriendRequests);
router.get("/received", verifyToken, getReceivedFriendRequests);

router.post("/:receiverId", verifyToken, sendFriendRequest);
router.put("/:friendRequestId", verifyToken, acceptFriendRequest);
router.delete("/:friendRequestId", verifyToken, declineOrCancelRequest);

export default router;
