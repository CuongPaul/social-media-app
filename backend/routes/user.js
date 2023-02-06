import express from "express";
import { validate } from "express-validation";

import {
    unfriendValidation,
    getUserByIdValidation,
    searchUsersValidation,
    updateProfileValidation,
    updatePasswordValidation,
    updateCoverImageValidation,
    getRecommendUsersValidation,
    updateAvatarImageValidation,
} from "../validator/user";
import {
    unfriendController,
    getUserByIdController,
    searchUsersController,
    updateProfileController,
    updatePasswordController,
    getCurrentUserController,
    updateCoverImageController,
    getRecommendUsersController,
    updateAvatarImageController,
} from "../controllers/user";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put(
    "/update-profile",
    validate(updateProfileValidation),
    verifyToken,
    updateProfileController
);
router.put(
    "/cover-image",
    validate(updateCoverImageValidation),
    verifyToken,
    updateCoverImageController
);
router.get(
    "/recommend-users",
    validate(getRecommendUsersValidation),
    verifyToken,
    getRecommendUsersController
);
router.put(
    "/avatar-image",
    validate(updateAvatarImageValidation),
    verifyToken,
    updateAvatarImageController
);
router.put(
    "/update-password",
    validate(updatePasswordValidation),
    verifyToken,
    updatePasswordController
);
router.get("/", verifyToken, getCurrentUserController);
router.get("/search", validate(searchUsersValidation), searchUsersController);
router.get("/:userId", validate(getUserByIdValidation), verifyToken, getUserByIdController);
router.put("/unfriend/:friendId", validate(unfriendValidation), verifyToken, unfriendController);

export default router;
