import express from "express";

import checkToken from "../middleware/check-token";
import {
    me,
    searchUsers,
    fetchUserById,
    updateProfile,
    updateCoverPic,
    updateProfilePic,
    clearNotification,
    fetchRecommandedUsers,
} from "../controllers/user";
import {
    sendFriendRequest,
    sendUnfriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    fetchSendedFriendRequest,
    cancelSendedFriendRequest,
    fetchIncommingFriendRequest,
} from "../controllers/friend-request";
import { sendMessageToFriend, getFriendMessages } from "../controllers/chat";

const router = express.Router();

router.get("/me", checkToken, me);
router.get("/recommanded_users", checkToken, fetchRecommandedUsers);
router.get("/friend_request/sended", checkToken, fetchSendedFriendRequest);
router.get("/friend_request/received", checkToken, fetchIncommingFriendRequest);

router.get("/search", searchUsers);
router.get("/friend_request/:userId/send", checkToken, sendFriendRequest);
router.patch("/unfriend_request", checkToken, sendUnfriendRequest);
router.get("/friend_request/:requestId/accept", checkToken, acceptFriendRequest);
router.get("/friend_request/:requestId/decline", checkToken, declineFriendRequest);
router.get("/friend_request/:requestId/cancel", checkToken, cancelSendedFriendRequest);
router.get("/:user_id", checkToken, fetchUserById);

router.post("/chat/:friendId/send", checkToken, sendMessageToFriend);
router.get("/chat/:friendId/get_messages", checkToken, getFriendMessages);

router.put("/profile_pic/update", checkToken, updateProfilePic);
router.put("/cover_pic/update", checkToken, updateCoverPic);
router.put("/update_profile/:input", checkToken, updateProfile);
router.delete("/notifications/clear", checkToken, clearNotification);

export default router;
