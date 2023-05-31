import express from "express";
import { validate } from "express-validation";

import {
    unfriendValidation,
    blockUserValidation,
    getUserByIdValidation,
    searchUsersValidation,
    unblockUserValidation,
    updateProfileValidation,
    searchFriendsValidation,
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
    unblockUserController,
    updateProfileController,
    searchFriendsController,
    getCurrentUserController,
    getOnlineFriendsController,
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
router.get(
    "/search-friends",
    validate(searchFriendsValidation),
    verifyToken,
    searchFriendsController
);
router.put(
    "/update-password",
    validate(updatePasswordValidation),
    verifyToken,
    updatePasswordController
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
router.get("/", verifyToken, getCurrentUserController);
router.get("/friends-online", verifyToken, getOnlineFriendsController);
router.get("/search", validate(searchUsersValidation), verifyToken, searchUsersController);
router.get("/:userId", validate(getUserByIdValidation), verifyToken, getUserByIdController);
router.put("/block/:userId", validate(blockUserValidation), verifyToken, blockUserController);
router.put("/unfriend/:friendId", validate(unfriendValidation), verifyToken, unfriendController);
router.put("/unblock/:userId", validate(unblockUserValidation), verifyToken, unblockUserController);

export default router;
