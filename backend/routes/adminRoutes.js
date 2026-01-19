import express from "express";
const router = express.Router();
import { getAllUsers, updateUserStatus } from "../controllers/authController.js";

import verifyToken from "../middlewares/verifyToken.js";


// Create GET route
router.get("/customers", verifyToken, getAllUsers);
router.put("/customers/:id/status", verifyToken, updateUserStatus);



export default router;
