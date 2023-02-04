import express from "express";

import {
    getUserById,
    searchUsers,
    updateProfile,
    updatePassword,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
} from "../controllers/user";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/search", searchUsers);
router.get("/:userId", verifyToken, getUserById);
router.put("/update-profile", verifyToken, updateProfile);
router.put("/cover-image", verifyToken, updateCoverImage);
router.put("/avatar-image", verifyToken, updateAvatarImage);
router.put("/update-password", verifyToken, updatePassword);
router.get("/recommend-users", verifyToken, getRecommendUsers);

export default router;
