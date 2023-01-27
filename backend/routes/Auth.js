import express from "express";

import checkToken from "../middleware/check-token";
import { login, logout, signup, updatePassword } from "../controllers/auth";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", checkToken, logout);
router.put("/update_password", checkToken, updatePassword);

export default router;
