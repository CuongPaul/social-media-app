import express from "express";
import { validate } from "express-validation";

import {
    getPostValidation,
    reactPostValidation,
    createPostValidation,
    deletePostValidation,
    updatePostValidation,
    getAllPostsValidation,
    getPostsByUserValidation,
} from "../validator/post";
import {
    getPostController,
    reactPostController,
    createPostController,
    deletePostController,
    updatePostController,
    getAllPostsController,
    getPostsByUserController,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get(
    "/user/:userId",
    validate(getPostsByUserValidation),
    verifyToken,
    getPostsByUserController
);
router.get("/", validate(getAllPostsValidation), getAllPostsController);
router.get("/:postId", validate(getPostValidation), verifyToken, getPostController);
router.post("/", validate(createPostValidation), verifyToken, createPostController);
router.put("/:postId", validate(updatePostValidation), verifyToken, updatePostController);
router.delete("/:postId", validate(deletePostValidation), verifyToken, deletePostController);
router.put("/react-post/:postId", validate(reactPostValidation), verifyToken, reactPostController);

export default router;
