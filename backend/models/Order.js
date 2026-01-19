import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema(
  {

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
 
    title: { type: String, required: true },
    subCategory:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,

    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required:true,
    },
  variant: {
  colorId: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
  sizeId: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
  color: String,
  size: String,
  sku: String,
},

    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    image: { type: String },
    oldPrice: { type: Number, default: 0 },
    itemStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema], 

    deliveryAddress: {
      fullname: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    pricing: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded","complete"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    cancelledBy: {
      type: String,
      enum: ["user", "admin", null],
      default: null,
    },
    timeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
