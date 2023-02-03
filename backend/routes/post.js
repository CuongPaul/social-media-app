import express from "express";

import {
    reactPost,
    createPost,
    deletePost,
    updatePost,
    getAllPosts,
    getPostsByUser,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/", verifyToken, getAllPosts);
router.put("/:postId", verifyToken, updatePost);
router.delete("/:postId", verifyToken, deletePost);
router.get("/:userId", verifyToken, getPostsByUser);
router.post("/react-post/:postId", verifyToken, reactPost);

export default router;
