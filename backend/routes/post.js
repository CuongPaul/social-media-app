import express from "express";

import {
    reactPost,
    createPost,
    deletePost,
    updatePost,
    getPostsByUser,
    getPostsByCurrentUser,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.patch("/:postId", verifyToken, updatePost);
router.delete("/:postId", verifyToken, deletePost);
router.get("/", verifyToken, getPostsByCurrentUser);
router.get("/:userId", verifyToken, getPostsByUser);
router.post("/react-post/:postId", verifyToken, reactPost);

export default router;
