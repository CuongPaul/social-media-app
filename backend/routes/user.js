import express from "express";
import { validate } from "express-validation";

import {
    unfriendValidation,
    blockUserValidation,
    friendListValidation,
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
    friendListController,
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
router.get("/friends", validate(friendListValidation), verifyToken, friendListController);
router.get("/search", validate(searchUsersValidation), verifyToken, searchUsersController);
router.get("/:userId", validate(getUserByIdValidation), verifyToken, getUserByIdController);
router.put("/block/:userId", validate(blockUserValidation), verifyToken, blockUserController);
router.put("/unfriend/:friendId", validate(unfriendValidation), verifyToken, unfriendController);

export default router;
