import express from "express";
import { validate } from "express-validation";

import { readNotificationValidation, getNotificationsValidation } from "../validator/notification";
import {
    readNotificationController,
    getNotificationsController,
    readAllNotificationController,
} from "../controllers/notification";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put(
    "/read/:notificationId",
    validate(readNotificationValidation),
    verifyToken,
    readNotificationController
);
router.put("/read-all", verifyToken, readAllNotificationController);
router.get("/", validate(getNotificationsValidation), verifyToken, getNotificationsController);

export default router;
