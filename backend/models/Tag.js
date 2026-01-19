import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);
