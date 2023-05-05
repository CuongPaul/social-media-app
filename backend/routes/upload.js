import express from "express";
import { validate } from "express-validation";

import verifyToken from "../middleware/verify-token";
import { uploadImagesValidation } from "../validator/upload"
import { uploadImagesController } from "../controllers/upload";

const router = express.Router();

router.post("/images", validate(uploadImagesValidation), verifyToken, uploadImagesController);

export default router;
