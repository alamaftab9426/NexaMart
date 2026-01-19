// routes/productRoutes.js
import express from "express";
import { createProduct, getProducts, getProductById,deleteProduct,updateProductStatus ,updateProduct,removeVariantImage} from "../controllers/productController.js";
import verifyToken from "../middlewares/verifyToken.js";
import uploadProductImage from "../middlewares/uploadProductImage.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
const router = express.Router();

router.post("/", verifyToken, uploadProductImage.any(), createProduct);
router.get("/",  getProducts);
router.get("/:id", verifyToken, getProductById);

router.get("/", verifyAdmin, getProducts);
router.delete("/:id", verifyToken, deleteProduct);
router.patch("/:id/status", verifyToken, updateProductStatus);
router.put("/:id", verifyToken, uploadProductImage.any(), updateProduct);
router.patch("/:id/remove-variant-image", verifyToken, removeVariantImage);

export default router;
