import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    profilePhoto: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("UserProfile", userProfileSchema);
