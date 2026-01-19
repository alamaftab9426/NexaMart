import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiMapPin, FiPhone, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { io } from "socket.io-client";
import Layout from "./Layout";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_URL;

/* ---------------- STEPS ---------------- */
const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];
const stepMap = { pending: 0, confirmed: 1, shipped: 2, delivered: 3 };

/* ---------------- PROGRESS BAR ---------------- */
const ProgressBar = ({ currentStep = 0 }) => {
  const totalSteps = steps.length;
  const progressWidth =
    currentStep === 0 ? "0%" : `${(currentStep / (totalSteps - 1)) * 100}%`;

  return (
    <div className="relative my-6">
      <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-300 rounded" />

      <motion.div
        className="absolute top-3 left-0 h-0.5 bg-red-600 rounded"
        initial={{ width: 0 }}
        animate={{ width: progressWidth }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex flex-col items-center w-8 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10
                ${
                  isCompleted || isActive
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-400 text-gray-500"
                }`}
              >
                {isCompleted ? <FiCheck /> : index + 1}
              </div>

              {isActive && (
                <motion.div
                  className="absolute w-10 h-10 rounded-full bg-red-400 opacity-20"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}

              <span
                className={`text-xs mt-1 font-semibold
                ${
                  isCompleted || isActive
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const AfterPlacedOrderPage = () => {
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  

  const socketRef = useRef(null);
  const orderIdRef = useRef(null);

  /* -------- FETCH LATEST ORDER -------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const latestOrder = res.data.order;
        setOrder(latestOrder);
        orderIdRef.current = latestOrder?._id;

        // 🔌 SOCKET
        const socket = io(BASE_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on(
          `orderUpdated-${latestOrder.userId._id}`,
          (data) => {
            if (data.orderId === orderIdRef.current) {
              setOrder((prev) => ({
                ...prev,
                orderStatus: data.status,
              }));
            }
          }
        );
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to fetch order",
          "error"
        );
      }
    };

    if (token) fetchOrder();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          No recent order found.
        </div>
      </Layout>
    );
  }

  /* -------- PRICE CALCULATION -------- */
  const totalPrice = order.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const discount = order.discount || 0;
  const deliveryFee = 50;
  const totalPayable = totalPrice - discount + deliveryFee;

  return (
    <Layout>
      <div className="min-h-screen p-4 md:p-8 bg-gray-50 md:px-28 flex flex-col md:flex-row gap-6">

        {/* ---------------- LEFT ---------------- */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-md p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* -------- ITEMS TABLE -------- */}
            <div className="overflow-x-auto">
              <table className="w-full border border-zinc-700 text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 border">Image</th>
                    <th className="p-3 border">Title</th>
                    <th className="p-3 border">Size</th>
                    <th className="p-3 border">Color</th>
                    <th className="p-3 border">Qty</th>
                    <th className="p-3 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-3 border w-24">
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt={item.title}
                          className="w-16 h-16 rounded-md object-cover border"
                        />
                      </td>
                      <td className="p-3 border">{item.title}</td>
                      <td className="p-3 border text-center">
                        {item.variant?.size || "-"}
                      </td>
                      <td className="p-3 border text-center">
                        {item.variant?.color || "-"}
                      </td>
                      <td className="p-3 border text-center">
                        {item.quantity}
                      </td>
                      <td className="p-3 border font-semibold">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* -------- PROGRESS -------- */}
            <ProgressBar
              currentStep={
                stepMap[order.orderStatus?.toLowerCase()] ?? 0
              }
            />
          </div>
        </div>

        {/* ---------------- RIGHT ---------------- */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">

          {/* DELIVERY */}
          <div className="bg-white rounded-md p-4 shadow">
            <h3 className="font-semibold mb-3">Delivery Details</h3>
            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <FiUser /> {order.deliveryAddress.fullname}
              </p>
              <p className="flex items-center gap-2">
                <FiMapPin /> {order.deliveryAddress.address},{" "}
                {order.deliveryAddress.city}
              </p>
              <p className="flex items-center gap-2">
                <FiPhone /> {order.deliveryAddress.mobile}
              </p>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-white rounded-md p-4 shadow">
            <h3 className="font-semibold mb-3">Price Details</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                Price ({order.items.length} items)
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                Discount <span>-₹{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                Delivery Fee <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                Total Payable
                <span>₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AfterPlacedOrderPage;
