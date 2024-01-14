import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addremoveFriends,
  getFriends,
  getUser,
  updateProfileViews,
} from "../controller/user.js";

const router = express.Router();

//READ

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getFriends);

//UPADATE

router.patch("/:id/:friendId", verifyToken, addremoveFriends);
router.patch("/:id/profileViews", verifyToken, updateProfileViews);

export default router;
