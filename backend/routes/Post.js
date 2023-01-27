import express from "express";

import {
    getPosts,
    editPost,
    createPost,
    deletePost,
    fetchPostById,
    likeDislikePost,
} from "../controllers/post";
import {
    editComment,
    createComment,
    deleteComment,
    fetchComments,
    likeDislikeComment,
} from "../controllers/comment";
import checkToken from "../middleware/check-token";

const router = express.Router();

router.get("/", checkToken, getPosts);
router.post("/", checkToken, createPost);
router.patch("/:postId", checkToken, editPost);
router.get("/:postId", checkToken, fetchPostById);
router.delete("/:postId", checkToken, deletePost);
router.get("/:postId/like_dislike", checkToken, likeDislikePost);

router.get("/:postId/comment", checkToken, fetchComments);
router.post("/:postId/comment", checkToken, createComment);
router.patch("/comment/:commentId", checkToken, editComment);
router.delete("/comment/:commentId", checkToken, deleteComment);
router.get("/comment/:commentId/like_dislike", checkToken, likeDislikeComment);

export default router;
