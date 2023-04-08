import express from "express";

import SignupUser from "../controllers/Auth/Signup";
import LoginUser from "../controllers/Auth/Login";
import Logout from "../controllers/Auth/Logout";
import ChangePassword from "../controllers/Auth/ChangePassword";
import authRequired from "../middleware/AuthRequired";

const router = express.Router();

router.post("/signup", SignupUser);
router.post("/login", LoginUser);
router.get("/logout", authRequired, Logout);
router.put("/update_password", authRequired, ChangePassword);

export default router;
