import express from "express";
import upload from "../middlewares/uploadUserPhoto.js";
import {
  saveUserProfile,
  getUserProfile,
} from "../controllers/userProfileController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getUserProfile);
router.post(
  "/",
  verifyToken,
  upload.single("profilePhoto"),
  saveUserProfile
);

export default router;
