import express from "express";

import {
    reactComment,
    createComment,
    deleteComment,
    updateComment,
    getCommentsByPost,
} from "../controllers/comment";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/:postId", verifyToken, getCommentsByPost);
router.post("/:postId", verifyToken, createComment);
router.put("/:commentId", verifyToken, updateComment);
router.delete("/:commentId", verifyToken, deleteComment);
router.get("/react-comment/:commentId", verifyToken, reactComment);

export default router;
