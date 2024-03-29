import multer from "multer";
import express from "express";

import verifyToken from "../middleware/verify-token";
import { uploadFilesController } from "../controllers/upload";

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

const router = express.Router();

router.post("/files", verifyToken, upload.any("files"), uploadFilesController);

export default router;
