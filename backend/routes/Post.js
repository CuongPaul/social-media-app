import express from "express";

import {
    createComment,
    fetchComments,
    likeDislikeComment,
    editComment,
    deleteComment,
} from "../controllers/Post/Comment";
import { fetchAllPosts, fetchPostById, deletePost, editPost } from "../controllers/Post/FetchPost";
import { createPost, likeDislikePost } from "../controllers/Post/postAction";
import authRequired from "../middleware/AuthRequired";

const router = express.Router();

router.post("/", authRequired, createPost);
router.get("/", authRequired, fetchAllPosts);
router.get("/:postId", authRequired, fetchPostById);
router.delete("/:postId", authRequired, deletePost);
router.patch("/:postId", authRequired, editPost);

router.delete("/comment/:commentId", authRequired, deleteComment);
router.patch("/comment/:commentId", authRequired, editComment);
router.get("/comment/:commentId/like_dislike", authRequired, likeDislikeComment);

router.get("/:postId/like_dislike", authRequired, likeDislikePost);
router.get("/:postId/comment", authRequired, fetchComments);
router.post("/:postId/comment", authRequired, createComment);

export default router;
