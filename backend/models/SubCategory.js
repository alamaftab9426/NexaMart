import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

  name: { type: String, required: true },
  slug: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

export default mongoose.model("SubCategory", subCategorySchema);
