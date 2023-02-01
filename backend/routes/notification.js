import express from "express";

import {
    readNotification,
    readAllNotification,
    getNotificationsByKey,
    getNotificationsByCurrentUser,
} from "../controllers/notification";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put("/read-all", verifyToken, readAllNotification);
router.get("/", verifyToken, getNotificationsByCurrentUser);
router.put("/:notificationId", verifyToken, readNotification);
router.put("/get-by-key/:notificationKey", verifyToken, getNotificationsByKey);

export default router;
