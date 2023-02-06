import express from "express";
import { validate } from "express-validation";

import { signinValidation, signupValidation } from "../validator/auth";
import { signinController, signupController } from "../controllers/auth";

const router = express.Router();

router.post("/signin", validate(signinValidation), signinController);
router.post("/signup", validate(signupValidation), signupController);

export default router;
