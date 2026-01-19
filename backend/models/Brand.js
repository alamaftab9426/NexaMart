// models/Brand.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  logo: { type: String }, 
   status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);
