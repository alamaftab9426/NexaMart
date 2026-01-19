import express from "express";
import {
  createTag,
  getTags,
  updateTag,
  deleteTag,
  toggleTagStatus,
} from "../controllers/tagController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createTag);
router.get("/", verifyToken, getTags);
router.put("/:id", verifyToken, updateTag);
router.delete("/:id", verifyToken, deleteTag);
router.put("/toggle/:id", verifyToken, toggleTagStatus);

export default router;
