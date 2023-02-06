import express from "express";
import { validate } from "express-validation";

import {
    reactPostValidation,
    createPostValidation,
    deletePostValidation,
    updatePostValidation,
    getAllPostsValidation,
    getPostsByUserValidation,
} from "../validator/post";
import {
    reactPostController,
    createPostController,
    deletePostController,
    updatePostController,
    getAllPostsController,
    getPostsByUserController,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get("/", validate(getAllPostsValidation), getAllPostsController);
router.post("/", validate(createPostValidation), verifyToken, createPostController);
router.put("/:postId", validate(updatePostValidation), verifyToken, updatePostController);
router.delete("/:postId", validate(deletePostValidation), verifyToken, deletePostController);
router.get("/:userId", validate(getPostsByUserValidation), verifyToken, getPostsByUserController);
router.put("/react-post/:postId", validate(reactPostValidation), verifyToken, reactPostController);

export default router;
