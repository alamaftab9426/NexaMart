import express from "express";
import {
    createSubCategory,
    getSubCategories,
    updateSubCategory,
    deleteSubCategory,
    toggleSubCategoryStatus
} from "../controllers/subCategory.js";
import verifyToken from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createSubCategory);
router.get("/", verifyToken, getSubCategories);
router.put("/:id", verifyToken, updateSubCategory);
router.delete("/:id", verifyToken, deleteSubCategory);
router.put("/toggle/:id", verifyToken, toggleSubCategoryStatus);

export default router;
