import express from "express";
import {
  saveAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/",verifyToken, saveAddress);
router.get("/",verifyToken, getAddresses);
router.put("/:id",verifyToken, updateAddress);
router.delete("/:id",verifyToken, deleteAddress);

export default router;
