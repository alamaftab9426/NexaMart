import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const statusSteps = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return setError("Token not found!");
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/orders`, {
          params: { status: filterStatus },
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filterStatus]);

  const updateStatus = async (orderId, newStatus) => {
    if (!token) return setError("Token not found!");
    try {
      const res = await axios.put(
        `${BASE_URL}/api/orders/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedOrder = res.data.order;
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder(updatedOrder);
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`, {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      // Confirmation before deleting
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this order? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
        reverseButtons: true,
      });

      if (!confirm.isConfirmed) return; // If user cancels, do nothing

      // Delete order
      await axios.delete(`${BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from frontend state
      setOrders(prev => prev.filter(o => o._id !== orderId));

      // Close modals if open
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
      if (selectedSlipOrder?._id === orderId) setSelectedSlipOrder(null);

      // Success toast
      toast.success("Order deleted successfully", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };


  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.orderStatus === filterStatus);

 const handlePrint = () => {
  if (!selectedSlipOrder) return;

  const printWindow = window.open("", "_blank", "width=1000,height=800");

  printWindow.document.write(`
    <html>
      <head>
        <title>Order Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 30px;
            color: #333;
          }
          h2 {
            text-align: center;
            margin-bottom: 25px;
          }
          p {
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
            font-size: 13px;
          }
          th, td {
            border: 1px solid #999;
            padding: 10px 8px;
            vertical-align: top;
          }
          th {
            background-color: #f3f3f3;
            text-align: left;
          }
          td.text-right {
            text-align: right;
          }
          td.text-center {
            text-align: center;
          }
          .totals {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h2>Order Invoice</h2>

        <p><strong>Order ID:</strong> ${selectedSlipOrder._id}</p>
        <p><strong>Customer:</strong> ${selectedSlipOrder.userId?.name}</p>
        <p><strong>Mobile:</strong> ${selectedSlipOrder.deliveryAddress.mobile}</p>
        <p><strong>Address:</strong> ${selectedSlipOrder.deliveryAddress.fullname}, ${selectedSlipOrder.deliveryAddress.address}, ${selectedSlipOrder.deliveryAddress.city}, ${selectedSlipOrder.deliveryAddress.state} - ${selectedSlipOrder.deliveryAddress.pincode}, ${selectedSlipOrder.deliveryAddress.country}</p>
        <p><strong>Date:</strong> ${new Date(selectedSlipOrder.createdAt).toLocaleString()}</p>
        <p><strong>Payment:</strong> ${selectedSlipOrder.paymentMethod}</p>
        <p><strong>Status:</strong> ${selectedSlipOrder.orderStatus.toUpperCase()}</p>

        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Color</th>
              <th>Size</th>
              <th>Brand</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Old Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${selectedSlipOrder.items.map(p => {
              const price = p.price;
              const finalPrice = p.discount ? price - (price * p.discount) / 100 : price;
              const oldPrice = p.oldPrice || "-";
              return `<tr>
                        <td>${p.title}</td>
                        <td>${p.subCategory?.name || "-"}</td>
                        <td>${p.variant?.color || "-"}</td>
                        <td>${p.variant?.size || "-"}</td>
                        <td>${p.brand?.name || "-"}</td>
                        <td class="text-center">${p.quantity}</td>
                        <td class="text-right">₹${price}</td>
                        <td class="text-right">${oldPrice !== "-" ? "₹" + oldPrice : "-"}</td>
                        <td class="text-right">₹${finalPrice * p.quantity}</td>
                      </tr>`;
            }).join("")}
          </tbody>
        </table>

        <div class="totals">
          <span>Total Items: ${selectedSlipOrder.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
          <span>Total Amount: ₹${selectedSlipOrder.pricing.totalAmount}</span>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};



  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Orders Panel</h1>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full font-medium shadow ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-center text-gray-500">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-gray-200">
              <tr>
                {["Order ID", "Customer", "Items", "Total Amount", "Payment", "Status", "Actions"].map(head => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500 font-medium">No orders found</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{order._id}</td>
                    <td className="px-6 py-4 text-sm">{order.userId?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">{order.items.length}</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{order.pricing.totalAmount}</td>
                    <td className="px-6 py-4 text-sm">{order.paymentMethod.toUpperCase()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${order.orderStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                        order.orderStatus === "confirmed" ? "bg-blue-100 text-blue-800" :
                          order.orderStatus === "shipped" ? "bg-indigo-100 text-indigo-800" :
                            order.orderStatus === "delivered" ? "bg-green-100 text-green-800" :
                              "bg-red-100 text-red-800"
                        }`}>{order.orderStatus.toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2 justify-center items-center">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700 transition text-xs font-medium" onClick={() => setSelectedOrder(order)}>Status</button>
                      <button className="bg-green-500 text-white px-3 py-1 rounded-md shadow hover:bg-green-600 transition text-xs font-medium" onClick={() => setSelectedSlipOrder(order)}>Slip</button>
                      {order.orderStatus === "cancelled" && (
                        <FiTrash2 className="text-red-600 hover:text-red-800 cursor-pointer transition" size={18} onClick={() => deleteOrder(order._id)} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}


      <ToastContainer />

      <AnimatePresence>
        {selectedOrder && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button className="text-gray-500 hover:text-gray-800 text-2xl font-bold transition" onClick={() => setSelectedOrder(null)}>×</button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
                {/* Delivery Info */}
                <div className="flex justify-between bg-gray-50 p-3 rounded-lg text-sm gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Delivery Address</h3>
                    <p><span className="font-medium">Fullname:</span> {selectedOrder.deliveryAddress.fullname}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedOrder.deliveryAddress.mobile}</p>
                    <p><span className="font-medium">Address:</span> {`${selectedOrder.deliveryAddress.address}, ${selectedOrder.deliveryAddress.city}, ${selectedOrder.deliveryAddress.state} - ${selectedOrder.deliveryAddress.pincode}, ${selectedOrder.deliveryAddress.country}`}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Total Items:</span> {selectedOrder.items.length}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.pricing.totalAmount}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod.toUpperCase()}</p>
                    <p><span className="font-medium">Status:</span> {selectedOrder.orderStatus.toUpperCase()}</p>
                  </div>
                </div>

                {/* Status Update Section */}

                <div className="flex flex-col gap-3 text-sm">
                  <h3 className="font-semibold text-gray-700 text-md flex justify-center items-center">Update Order Status</h3>

                  {/* Status Buttons */}
                  <div className="flex gap-2  justify-center items-center ">
                    {statusSteps.map((step) => (
                      <button
                        key={step}
                        className="px-3 py-1 rounded-full border border-gray-400 text-xs font-medium hover:bg-gray-100 transition"
                        onClick={() => updateStatus(selectedOrder._id, step)}
                        disabled={selectedOrder.orderStatus === "cancelled"}
                      >
                        {step.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Cancelled Message */}
                  {selectedOrder.orderStatus === "cancelled" ? (
                    <div className="w-full p-4 bg-red-50 rounded text-center border border-red-200">
                      <h3 className="text-sm font-semibold text-red-700">Order Cancelled</h3>
                    </div>
                  ) : (
                    <>

                      {/* STEPS + PROGRESS LINE */}
                      <div className="relative mt-2 flex items-center justify-betwee">
                        {statusSteps.slice(0, -1).map((step, index) => {
                          const currentStep = statusSteps.indexOf(selectedOrder.orderStatus);
                          const isDone = index <= currentStep;

                          return (
                            <div key={step} className="flex-1 relative flex flex-col items-center z-10">
                              {index < statusSteps.length - 2 && (
                                <div className="absolute top-1/2 left-1/2 right-[-50%] h-1 -mt-3 bg-gray-300 -z-10">
                                  <motion.div
                                    className="h-1  bg-red-600 rounded"
                                    style={{ originX: 0 }}
                                    animate={{
                                      width: index < currentStep ? "100%" : "0%",
                                    }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                  />
                                </div>
                              )}

                              {/* Ball */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border
          ${isDone ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-500 border-gray-400"}
        `}
                              >
                                {index + 1}
                              </div>

                              {/* Label */}
                              <span className="text-xs mt-2">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                            </div>
                          );
                        })}
                      </div>

                    </>
                  )}
                </div>



                {/* Products Grid */}
                <div className="bg-gray-50 p-4 rounded-lg flex-1 mt-4">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Products in Order</h3>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="min-w-full border border-gray-200">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Image</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Title</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Color</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Size</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Brand</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Category</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Qty</th>
                          <th className="p-2 border-b text-left text-xs text-gray-600">Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedOrder.items.map((p, idx) => {
                          const finalPrice = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
                          return (
                            <tr key={idx} className="bg-white">

                              <td className="p-2 border-b w-20">
                                <img
                                  src={`${BASE_URL}${p.image}`}
                                  alt={p.title}
                                  className=
                                  "w-16 h-16 object-cover rounded"
                                />
                              </td>
                              <td className="p-2 border-b text-sm">{p.title}</td>
                              <td className="p-2 border-b text-sm">{p.variant?.color || "-"}</td>
                              <td className="p-2 border-b text-sm">{p.variant?.size || "-"}</td>
                              <td className="p-2 border-b text-sm">{p.brand?.name || "-"}</td>
                              <td className="p-2 border-b text-sm">{p.subCategory?.name || "-"}</td>
                              <td className="p-2 border-b text-sm">{p.quantity}</td>
                              <td className="p-2 border-b text-sm">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-900">₹{finalPrice}</span>
                                  {p.discount && (
                                    <span className="text-red-500 text-xs line-through">₹{p.price}</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );

                        })}

                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSlipOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Slip</h2>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold transition"
                  onClick={() => setSelectedSlipOrder(null)}
                >
                  ×
                </button>
              </div>

              {/* Customer & Order Summary */}
              <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <p><span className="font-semibold">Order ID:</span> {selectedSlipOrder._id}</p>
                  <p><span className="font-semibold">Customer:</span> {selectedSlipOrder.userId?.name}</p>
                  <p><span className="font-semibold">Mobile:</span> {selectedSlipOrder.deliveryAddress.mobile}</p>

                  <p><span className="font-semibold">Address:</span> {`${selectedSlipOrder.deliveryAddress.fullname}, ${selectedSlipOrder.deliveryAddress.address}, ${selectedSlipOrder.deliveryAddress.city}, ${selectedSlipOrder.deliveryAddress.state} - ${selectedSlipOrder.deliveryAddress.pincode}, ${selectedSlipOrder.deliveryAddress.country}`}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p><span className="font-semibold">Payment:</span> {selectedSlipOrder.paymentMethod.toUpperCase()}</p>
                  <p><span className="font-semibold">Status:</span> {selectedSlipOrder.orderStatus.toUpperCase()}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(selectedSlipOrder.createdAt).toLocaleString()}</p>
                  <p><span className="font-semibold">Total Items:</span> {selectedSlipOrder.items.length}</p>
                  <p><span className="font-semibold">Total Amount:</span> ₹{selectedSlipOrder.pricing.totalAmount}</p>
                </div>
              </div>

              {/* Products Table */}
              <div className="p-4 overflow-x-auto flex-1">
                <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Title</th>

                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Color</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Size</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Brand</th>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Price</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Old Price</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedSlipOrder.items.map((p, idx) => {
                      const finalPrice = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
                      return (
                        <tr key={idx} className="bg-white">
                          <td className="px-3 py-2 text-sm text-gray-800">{p.title}</td>

                          <td className="px-3 py-2 text-sm text-gray-700">{p.variant?.color || "-"}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{p.variant?.size || "-"}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{p.brand?.name || "-"}</td>
                          <td className="px-3 py-2 text-sm text-gray-700">{p.subCategory?.name || "-"}</td>
                          <td className="px-3 py-2 text-sm text-center">{p.quantity}</td>
                          <td className="px-3 py-2 text-sm text-right">₹{p.price}</td>
                          <td className="px-3 py-2 text-sm text-right">₹{p.oldPrice}</td>

                          <td className="px-3 py-2 text-sm text-right">₹{finalPrice * p.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals & Buttons */}
              <div className="flex justify-between items-center p-4 border-t mt-2">
                <div className="font-semibold">
                  <p>Total Items: {selectedSlipOrder.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                  <p>Total Amount: ₹{selectedSlipOrder.pricing.totalAmount}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
                    onClick={() => setSelectedSlipOrder(null)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium transition"
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

export default AdminOrders;
