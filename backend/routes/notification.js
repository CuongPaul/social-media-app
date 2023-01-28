import express from "express";

import {
    readNotification,
    readAllNotification,
    getNotificationsByKey,
    getNotificationsByUser,
} from "../controllers/notification";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/", verifyToken, getNotificationsByUser);
router.put("/read-all", verifyToken, readAllNotification);
router.put("/:notificationId", verifyToken, readNotification);
router.put("/get-by-key/:notificationKey", verifyToken, getNotificationsByKey);

export default router;
