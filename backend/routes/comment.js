import express from "express";
import { validate } from "express-validation";

import {
    reactCommentValidation,
    createCommentValidation,
    deleteCommentValidation,
    updateCommentValidation,
    getCommentsByPostValidation,
} from "../validator/comment";
import {
    reactCommentController,
    createCommentController,
    deleteCommentController,
    updateCommentController,
    getCommentsByPostController,
} from "../controllers/comment";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.put(
    "/react-comment/:commentId",
    validate(reactCommentValidation),
    verifyToken,
    reactCommentController
);
router.delete(
    "/:commentId",
    validate(deleteCommentValidation),
    verifyToken,
    deleteCommentController
);
router.post("", validate(createCommentValidation), verifyToken, createCommentController);
router.get("", validate(getCommentsByPostValidation), verifyToken, getCommentsByPostController);
router.put("/:commentId", validate(updateCommentValidation), verifyToken, updateCommentController);

export default router;
