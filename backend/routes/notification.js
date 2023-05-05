import express from "express";
import { validate } from "express-validation";

import {
    readNotificationController,
    getNotificationsController,
    readAllNotificationController,
} from "../controllers/notification";
import verifyToken from "../middleware/verify-token";
import { readNotificationValidation, getNotificationsValidation } from "../validator/notification";

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
