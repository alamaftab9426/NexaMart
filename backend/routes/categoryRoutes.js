import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();


router.post("/", verifyToken, createCategory);
router.get("/", verifyToken, getCategories);
router.put("/:id", verifyToken, updateCategory);
router.delete("/:id", verifyToken, deleteCategory);
router.put("/toggle/:id", verifyToken, toggleCategoryStatus);

export default router;
