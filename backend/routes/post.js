import multer from "multer";
import express from "express";
import { validate } from "express-validation";

import {
    getPostValidation,
    reactPostValidation,
    removeTagValidation,
    deletePostValidation,
    getAllPostsValidation,
    getPostsByUserValidation,
} from "../validator/post";
import {
    getPostController,
    reactPostController,
    removeTagController,
    createPostController,
    deletePostController,
    updatePostController,
    getAllPostsController,
    getPostsByUserController,
} from "../controllers/post";
import verifyToken from "../middleware/verify-token";
import uploadFiles from "../middleware/upload-files";

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
const router = express.Router();

router.get(
    "/user/:userId",
    validate(getPostsByUserValidation),
    verifyToken,
    getPostsByUserController
);
router.get("/", validate(getAllPostsValidation), getAllPostsController);
router.get("/:postId", validate(getPostValidation), verifyToken, getPostController);
router.post("/", verifyToken, upload.any("images"), uploadFiles, createPostController);
router.put("/:postId", verifyToken, upload.any("images"), uploadFiles, updatePostController);
router.delete("/:postId", validate(deletePostValidation), verifyToken, deletePostController);
router.put("/react-post/:postId", validate(reactPostValidation), verifyToken, reactPostController);
router.put("/remove-tag/:postId", validate(removeTagValidation), verifyToken, removeTagController);

export default router;
