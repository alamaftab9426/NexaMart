import express from "express";
import {
  createOrder,
  getAllUserOrders,
  getLatestOrder,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
 
} from "../controllers/orderController.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

//USER ROUTES
router.post("/", verifyToken, createOrder);                
router.get("/userOrders", verifyToken, getAllUserOrders);     
router.get("/latest", verifyToken, getLatestOrder);      

// ADMIN ROUTES 
router.get("/", verifyToken, verifyAdmin, getMyOrders);         
router.put("/status/:orderId", verifyToken, verifyAdmin, updateOrderStatus); 
router.delete("/:orderId", verifyToken, verifyAdmin, deleteOrder); 


export default router;
