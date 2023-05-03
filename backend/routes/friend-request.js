import express from "express";
import { validate } from "express-validation";

import {
    sendFriendRequestValidation,
    acceptFriendRequestValidation,
    declineOrCancelRequestValidation,
    getSendedFriendRequestsValidation,
    getReceivedFriendRequestsValidation,
} from "../validator/friend-request";
import {
    sendFriendRequestController,
    acceptFriendRequestController,
    declineOrCancelRequestController,
    getSendedFriendRequestsController,
    getReceivedFriendRequestsController,
} from "../controllers/friend-request";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.post(
    "",
    validate(sendFriendRequestValidation),
    verifyToken,
    sendFriendRequestController
);
router.put(
    "/:friendRequestId",
    validate(acceptFriendRequestValidation),
    verifyToken,
    acceptFriendRequestController
);
router.delete(
    "/:friendRequestId",
    validate(declineOrCancelRequestValidation),
    verifyToken,
    declineOrCancelRequestController
);
router.get(
    "/sended",
    validate(getSendedFriendRequestsValidation),
    verifyToken,
    getSendedFriendRequestsController
);
router.get(
    "/received",
    validate(getReceivedFriendRequestsValidation),
    verifyToken,
    getReceivedFriendRequestsController
);

export default router;
