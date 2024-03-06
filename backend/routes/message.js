import express from "express";
import { validate } from "express-validation";

import {
  getMessagesValidatetion,
  reactMessageValidatetion,
  createMessageValidatetion,
  // deleteMessageValidatetion,
  updateMessagesValidatetion,
} from "../validator/message";
import {
  getMessagesController,
  reactMessageController,
  createMessageController,
  // deleteMessageController,
  updateMessagesController,
} from "../controllers/message";
import verifyToken from "../middleware/verify-token";

const router = express.Router();

router.get(
  "/chat-room/:chatRoomId",
  validate(getMessagesValidatetion),
  verifyToken,
  getMessagesController
);
router.put(
  "/react-message/:messageId",
  validate(reactMessageValidatetion),
  verifyToken,
  reactMessageController
);
// router.delete(
//     "/:meassageId",
//     validate(deleteMessageValidatetion),
//     verifyToken,
//     deleteMessageController
// );
router.put(
  "/:meassageId",
  validate(updateMessagesValidatetion),
  verifyToken,
  updateMessagesController
);
router.post(
  "",
  validate(createMessageValidatetion),
  verifyToken,
  createMessageController
);

export default router;
