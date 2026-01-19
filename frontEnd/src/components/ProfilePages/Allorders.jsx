import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const stepMap = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  completed: 3,
  delivered: 3,
};

const steps = ["Pending", "Confirmed", "Shipped", "Completed"];

const ProgressBar = ({ currentStep }) => {
  const totalSteps = steps.length;
  const progressWidth =
    currentStep === 0 ? "0%" : `${(currentStep / (totalSteps - 1)) * 100}%`;

  return (
    <div className="relative my-6">
      <div className="absolute top-3 left-0 w-full h-0.5 bg-zinc-700/50 rounded "></div>

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
            <div key={index} className="flex flex-col items-center relative w-6 md:w-8 ">
              <div
                className={`w-6 md:w-8 h-6 md:h-8 rounded-full flex items-center justify-center border md:border-2 shadow-sm
                ${
                  isCompleted || isActive
                    ? "bg-red-600 border-red-600 text-white shadow-red-600/30"
                    : "bg-white border-zinc-600 text-black"
                }`}
              >
                {isCompleted ? <FiCheck className="text-white" /> : index + 1}
              </div>

              {isActive && (
                <motion.div
                  className="absolute w-8 md:w-12  h-10 md:h-12 rounded-full bg-red-500 opacity-20 -z-10"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              <span
                className={`text-xs md:text-md mt-1 tracking-wide font-semibold
                ${
                  isCompleted || isActive
                    ? "text-red-400 font-semibold"
                    : "text-gray-600"
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

const AllOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/userOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mappedOrders = res.data.orders.map((order) => ({
          _id: order._id,
          status: order.orderStatus,
          products: order.items.map((item) => ({
            _id: item._id,
            title: item.title,
            size: item.variant?.size || item.size || "-",
            color: item.variant?.color || item.color || "-",
            quantity: item.quantity,
            price: item.price,
            image: item.image.includes("http") ? item.image : `${BASE_URL}${item.image}`,
          })),
        }));

        setOrders(mappedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No orders found
      </div>
    );

  return (
    <div className="min-h-screen border p-4 md:p-8 rounded-md shadow-sm bg-[#EFF4F7] font-[Quicksand]">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-600">
        Your Orders
      </h1>

      {isMobile ? (
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => {
            const items = order.products;
            const grandTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return (
              <div key={order._id} className="rounded-xl px-6 py-6 border border-zinc-800 bg-white">
                {/* Header */}
                <div className="flex justify-between items-center pb-3 mb-4 border-b border-zinc-700">
                  <h2 className="font-semibold text-md tracking-wide ">Order #{index + 1}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize text-white 
                      ${
                        order.status === "confirmed"
                          ? "bg-green-700"
                          : order.status === "shipped"
                          ? "bg-blue-700"
                          : order.status === "delivered"
                          ? "bg-purple-700"
                          : "bg-red-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-6 text-[11px] font-semibold border-b border-zinc-700 pb-2 uppercase ">
                  <span className="text-center">Image</span>
                  <span className="text-center">Title</span>
                  <span className="text-center">Size</span>
                  <span className="text-center">Color</span>
                  <span className="text-center">Qty</span>
                  <span className="text-center">Price</span>
                </div>

                {/* Table Rows */}
                {items.map((item) => (
                  <div key={item._id} className="grid grid-cols-6 text-xs py-3 border-b border-zinc-800 ">
                    <div className="flex items-center justify-center">
                      <img
                        src={item.image}
                        className="w-12 h-12 rounded-md object-cover border border-zinc-700"
                      />
                    </div>
                    <div className="flex items-center justify-center text-center px-1">{item.title}</div>
                    <div className="flex items-center justify-center text-center px-1">{item.size}</div>
                    <div className="flex items-center justify-center text-center px-1">{item.color}</div>
                    <div className="flex items-center justify-center text-center px-1">{item.quantity}</div>
                    <div className="flex items-center justify-center text-center font-semibold px-1">₹{item.price}</div>
                  </div>
                ))}

                {/* Grand Total */}
                <div className="flex justify-between text-sm font-semibold border-zinc-700 pt-3">
                  <span>Total Amount:</span>
                  <span>₹{grandTotal.toLocaleString()}</span>
                </div>

                {order.status === "cancelled" ? (
                  <p className="text-center text-red-600 font-semibold mt-4">Order Cancelled</p>
                ) : (
                  <ProgressBar currentStep={stepMap[order.status]} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Desktop View (same as mobile structure) */
        <div className="flex flex-col gap-8 ">
          {orders.map((order, index) => {
            const items = order.products;

            return (
              <div key={order._id} className="rounded-xl p-6 border bg-white ">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-zinc-700">
                  <h2 className="font-semibold tracking-wide">Order #{index + 1}</h2>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize
                    ${
                      order.status === "confirmed"
                        ? "bg-green-600 text-white"
                        : order.status === "shipped"
                        ? "bg-blue-600 text-white"
                        : order.status === "delivered"
                        ? "bg-purple-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border ">
                    <thead className="text-gray-600">
                      <tr>
                        <th className="p-3 border border-zinc-700">Image</th>
                        <th className="p-3 border border-zinc-700">Title</th>
                        <th className="p-3 border border-zinc-700">Size</th>
                        <th className="p-3 border border-zinc-700">Color</th>
                        <th className="p-3 border border-zinc-700">Qty</th>
                        <th className="p-3 border border-zinc-700">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item._id}>
                          <td className="p-3 border border-zinc-700 w-24">
                            <img
                              src={item.image}
                              className="w-20 h-20 object-cover rounded-md border border-zinc-600"
                            />
                          </td>
                          <td className="p-3 border border-zinc-700">{item.title}</td>
                          <td className="p-3 border border-zinc-700">{item.size}</td>
                          <td className="p-3 border border-zinc-700">{item.color}</td>
                          <td className="p-3 border border-zinc-700">{item.quantity}</td>
                          <td className="p-3 border border-zinc-700 font-semibold">₹{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {order.status === "cancelled" ? (
                  <p className="text-red-400 text-center font-semibold mt-6">Order Cancelled</p>
                ) : (
                  <ProgressBar currentStep={stepMap[order.status]} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
