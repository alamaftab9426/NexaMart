import mongoose from "mongoose";


const sizeSchema = new mongoose.Schema({
  size: { type: mongoose.Schema.Types.ObjectId, ref: "Size", required: true },

  sku: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  quantity: { type: Number, required: true }
});

const variantSchema = new mongoose.Schema({
  color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
  images: [{ type: String, required: true }],
  sizes: [sizeSchema]
});


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true
    },

    tagId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
      }
    ],

    description: [{ type: String }],

    variants: [variantSchema],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
