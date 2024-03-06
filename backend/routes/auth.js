import express from "express";
import { validate } from "express-validation";

import {
  signinValidation,
  signupValidation,
  signoutValidation,
} from "../validator/auth";
import {
  signinController,
  signupController,
  signoutController,
} from "../controllers/auth";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.post("/signin", validate(signinValidation), signinController);
router.post("/signup", validate(signupValidation), signupController);
router.post(
  "/signout",
  validate(signoutValidation),
  verifyToken,
  signoutController
);

export default router;
