import multer from "multer";
import express from "express";
import { validate } from "express-validation";

import verifyToken from "../middleware/verify-token";
import { uploadImagesValidation } from "../validator/upload";
import { uploadImagesController } from "../controllers/upload";

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
const router = express.Router();

router.post(
    "/images",
    validate(uploadImagesValidation),
    verifyToken,
    upload.any("pic"),
    uploadImagesController
);

export default router;
