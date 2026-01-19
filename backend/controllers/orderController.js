import Product from "../models/Product.js";
import Color from "../models/Color.js";
import Size from "../models/Size.js";

import Order from "../models/Order.js";
import { sendOrderStatusMail } from "../utils/sendOrderStatusMail.js";

// update order status admin pannel and also murge nodemailer
export const updateOrderStatus = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const { orderId } = req.params;
    const { status } = req.body;
  
    const allowedStatus = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    let order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.orderStatus = status;
    order.timeline.push({ status, date: new Date() });

    if (status === "delivered") {
      order.paymentStatus = "complete";
    }

    await order.save();

    

    order = await Order.findById(orderId)
      .populate("userId", "name emailaddress")
      .populate("items.brand", "name")
      .populate("items.subCategory", "name");

    const io = req.app.get("io");
    io.emit(`orderUpdated-${order.userId._id}`, { orderId: order._id, status: order.orderStatus });

    if (order.userId?.emailaddress) {
  console.log("📧 Email trigger START");
  console.log("To:", order.userId.emailaddress);
  console.log("Name:", order.userId.name);
  console.log("Status:", status);
  
  await sendOrderStatusMail(
    
    order.userId.emailaddress,
    order.userId.name,
    order._id,
    status,
    order.items
  );
  
  console.log("📧 Email trigger END");
} else {
  console.log("USER DATA =>", order.userId);
  console.log("❌ User email not found");
}



    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("UpdateOrderStatus Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const requiredFields = ["fullname", "mobile", "address", "city", "state", "country", "pincode"];
    for (const field of requiredFields) {
      if (!deliveryAddress?.[field]) {
        return res.status(400).json({ message: `Delivery address "${field}" is required` });
      }
    }

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId)
        .populate("subCategoryId")
        .populate("brandId");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Find the correct color variant
      let variant = product.variants.find(v => String(v.color) === String(item.variant.colorId));
      if (!variant) {
        return res.status(400).json({ message: `Color not found for ${product.name}` });
      }

      // Find the correct size variant
      let sizeVariant = variant.sizes.find(s => String(s.size) === String(item.variant.sizeId));
      if (!sizeVariant) {
        return res.status(400).json({ message: `Size not found for ${product.name}` });
      }

      // Check stock
      if (sizeVariant.quantity < item.quantity) {
        return res.status(400).json({ message: `${product.name} out of stock` });
      }

      // Deduct stock
      sizeVariant.quantity -= item.quantity;
      await product.save();

   
      const colorName = await Color.findById(variant.color).then(c => c?.name || "Unknown");
      const sizeName = await Size.findById(sizeVariant.size).then(s => s?.name || "Unknown");

      // Prepare order item
      orderItems.push({
        productId: product._id,
        title: product.name,
        subCategory: product.subCategoryId._id,
        brand: product.brandId._id,
        variant: {
          colorId: variant.color,
          sizeId: sizeVariant.size,
          color: colorName,
          size: sizeName,
          sku: sizeVariant.sku,
        },
        price: sizeVariant.price,
        quantity: item.quantity,
         image: variant.images && variant.images.length > 0 ? variant.images[0] : "", 
        oldPrice: sizeVariant.oldPrice || 0,
      });
    }

    // Calculate pricing
    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = 0;
    const totalAmount = subtotal + shipping;

    // Create order
    const newOrder = new Order({
      userId,
      items: orderItems,
      deliveryAddress,
      pricing: { subtotal, shipping, totalAmount },
      paymentMethod: paymentMethod || "COD",
      timeline: [{ status: "pending" }],
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      totalAmount: savedOrder.pricing.totalAmount,
      items: savedOrder.items,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ message: "Order creation failed", error: err.message });
  }
};

// Get the most recent order of logged in user
export const getLatestOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestOrder = await Order.findOne({ userId }) // ✅ FIX HERE
      .sort({ createdAt: -1 })
      .populate("items.productId", "title price image")
      .lean();

    if (!latestOrder) {
      return res.status(404).json({ message: "No recent order found" });
    }

    res.status(200).json({ order: latestOrder });
  } catch (err) {
    console.error("GET LATEST ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch latest order" });
  }
};

// via admin  
export const getMyOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "title price")
      .populate("items.subCategory", "name")
      .populate("items.brand", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("GetAllOrders Error:", error.message);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// USER: Get all orders of logged-in user
export const getAllUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }) 
      .sort({ createdAt: -1 })
      .populate("items.productId", "title price image")
      .populate("items.brand", "name")
      .populate("items.subCategory", "name")
      .lean();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.error("GetAllUserOrders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.deleteOne();

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
