import express from "express";
import {
  getColors,
  createColor,
  updateColor,
  deleteColor,
  toggleColorStatus,
} from "../controllers/colorController.js";

const router = express.Router();

// Routes
router.get("/", getColors);
router.post("/", createColor);
router.put("/:id", updateColor);
router.delete("/:id", deleteColor);
router.put("/toggle/:id", toggleColorStatus);

export default router;
