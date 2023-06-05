import express from "express";
import { validate } from "express-validation";

import {
    changeAdminValidation,
    joinChatRoomValidation,
    leaveChatRoomValidation,
    createChatRoomValidation,
    deleteChatRoomValidation,
    searchChatRoomsValidation,
    updateInfoChatRoomValidation,
    addMembersToChatRoomValidation,
    removeMembersFromChatRoomValidation,
    createChatRoomForTwoPeopleValidation,
} from "../validator/chat-room";
import {
    changeAdminController,
    joinChatRoomController,
    leaveChatRoomController,
    createChatRoomController,
    deleteChatRoomController,
    searchChatRoomsController,
    getChatRoomsByUserController,
    updateInfoChatRoomController,
    addMembersToChatRoomController,
    removeMembersFromChatRoomController,
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
    "/update-info/:chatRoomId",
    validate(updateInfoChatRoomValidation),
    verifyToken,
    updateInfoChatRoomController
);
router.put(
    "/add-member/:chatRoomId",
    validate(addMembersToChatRoomValidation),
    verifyToken,
    addMembersToChatRoomController
);
router.put(
    "/remove-member/:chatRoomId",
    validate(removeMembersFromChatRoomValidation),
    verifyToken,
    removeMembersFromChatRoomController
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
