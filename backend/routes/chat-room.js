import express from "express";
import { validate } from "express-validation";

import {
    changeAdminValidation,
    joinChatRoomValidation,
    leaveChatRoomValidation,
    createChatRoomValidation,
    deleteChatRoomValidation,
    searchChatRoomsValidation,
    addMemberChatRoomValidation,
    updateNameChatRoomValidation,
    removeMemberChatRoomValidation,
    updateAvatarChatRoomValidation,
    updatePrivacyChatRoomValidation,
    createChatRoomForTwoPeopleValidation,
} from "../validator/chat-room";
import {
    changeAdminController,
    joinChatRoomController,
    leaveChatRoomController,
    createChatRoomController,
    deleteChatRoomController,
    searchChatRoomsController,
    addMemberChatRoomController,
    getChatRoomsByUserController,
    updateNameChatRoomController,
    removeMemberChatRoomController,
    updateAvatarChatRoomController,
    updatePrivacyChatRoomController,
    createChatRoomForTwoPeopleController,
} from "../controllers/chat-room";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put(
    "/change-admin/:chatRoomId",
    validate(changeAdminValidation),
    verifyToken,
    changeAdminController
);
router.put(
    "/join-chat/:chatRoomId",
    validate(joinChatRoomValidation),
    verifyToken,
    joinChatRoomController
);
router.put(
    "/leave-chat/:chatRoomId",
    validate(leaveChatRoomValidation),
    verifyToken,
    leaveChatRoomController
);
router.delete(
    "/:chatRoomId",
    validate(deleteChatRoomValidation),
    verifyToken,
    deleteChatRoomController
);
router.put(
    "/add-member/:chatRoomId",
    validate(addMemberChatRoomValidation),
    verifyToken,
    addMemberChatRoomController
);
router.put(
    "/update-name/:chatRoomId",
    validate(updateNameChatRoomValidation),
    verifyToken,
    updateNameChatRoomController
);
router.put(
    "/remove-member/:chatRoomId",
    validate(removeMemberChatRoomValidation),
    verifyToken,
    removeMemberChatRoomController
);
router.put(
    "/update-avatar/:chatRoomId",
    validate(updateAvatarChatRoomValidation),
    verifyToken,
    updateAvatarChatRoomController
);
router.put(
    "/update-privacy/:chatRoomId",
    validate(updatePrivacyChatRoomValidation),
    verifyToken,
    updatePrivacyChatRoomController
);
router.post(
    "/two-people",
    validate(createChatRoomForTwoPeopleValidation),
    verifyToken,
    createChatRoomForTwoPeopleController
);
router.get("/", verifyToken, getChatRoomsByUserController);
router.post("/", validate(createChatRoomValidation), verifyToken, createChatRoomController);
router.get("/search", validate(searchChatRoomsValidation), verifyToken, searchChatRoomsController);

export default router;
