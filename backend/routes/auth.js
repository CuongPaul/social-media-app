import express from "express";
import { validate } from "express-validation";

import verifyToken from "../middleware/verify-token";
import { signinValidation, signupValidation } from "../validator/auth";
import { signinController, signupController, signoutController } from "../controllers/auth";

const router = express.Router();

router.post("/signout", verifyToken, signoutController);
router.post("/signin", validate(signinValidation), signinController);
router.post("/signup", validate(signupValidation), signupController);

export default router;
