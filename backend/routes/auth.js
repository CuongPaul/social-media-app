import express from "express";

import verifyToken from "../middleware/verify-token";
import { signin, signup, signout, updatePassword } from "../controllers/auth";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/signout", verifyToken, signout);
router.put("/update-password", verifyToken, updatePassword);

export default router;
