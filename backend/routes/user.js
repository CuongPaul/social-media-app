import express from "express";

import {
    unfriend,
    getUserById,
    searchUsers,
    updateProfile,
    updatePassword,
    getCurrentUser,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
} from "../controllers/user";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/", verifyToken, getCurrentUser);
router.get("/:userId", verifyToken, getUserById);
router.put("/unfriend/:friendId", verifyToken, unfriend);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/cover-image", verifyToken, updateCoverImage);
router.put("/avatar-image", verifyToken, updateAvatarImage);
router.put("/update-password", verifyToken, updatePassword);
router.get("/recommend-users", verifyToken, getRecommendUsers);

export default router;
