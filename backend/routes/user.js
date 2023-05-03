import express from "express";
import { validate } from "express-validation";

import {
    unfriendValidation,
    blockUserValidation,
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
    blockUserController,
    getUserByIdController,
    searchUsersController,
    updateProfileController,
    getCurrentUserController,
    updatePasswordController,
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
router.get("/:userId", validate(getUserByIdValidation), getUserByIdController);
router.put("/block/:userId", validate(blockUserValidation), verifyToken, blockUserController);
router.put("/unfriend/:friendId", validate(unfriendValidation), verifyToken, unfriendController);

export default router;
