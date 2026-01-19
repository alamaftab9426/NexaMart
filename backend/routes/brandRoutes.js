// routes/brandRoutes.js
import express from "express";
import {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    toggleBrandStatus

} from "../controllers/brandController.js";
import verifyToken from "../middlewares/verifyToken.js";
import uploadBrandLogo from "../middlewares/uploadBrandLogo.js";

const router = express.Router();

router.post("/", verifyToken, uploadBrandLogo.single("logo"), createBrand);
router.get("/", verifyToken, getBrands);
router.put("/:id", uploadBrandLogo.single("logo"), updateBrand);
router.delete("/:id", deleteBrand);
router.put("/toggle/:id", toggleBrandStatus);

export default router;
