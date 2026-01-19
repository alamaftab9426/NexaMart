import express from "express";
import {
  createSize,
  getSizes,
  updateSize,
  deleteSize,
  toggleSizeStatus,
} from "../controllers/sizeController.js";

const router = express.Router();

router.post("/", createSize);
router.get("/", getSizes);
router.put("/:id", updateSize);
router.delete("/:id", deleteSize);
router.put("/toggle/:id", toggleSizeStatus);

export default router;
