import express from "express";

import {
    editPost,
    reactPost,
    createPost,
    deletePost,
    getAllPost,
    getPostsByUser,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/", verifyToken, getAllPost);
router.post("/", verifyToken, createPost);
router.patch("/:postId", verifyToken, editPost);
router.get("/:userId", verifyToken, getPostsByUser);
router.delete("/:postId", verifyToken, deletePost);
router.post("/react-post/:postId", verifyToken, reactPost);

export default router;
