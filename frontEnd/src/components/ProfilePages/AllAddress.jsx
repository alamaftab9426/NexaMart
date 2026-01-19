import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const AllAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); 

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Fetch addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        toast.error("Failed to fetch addresses");
      }
    };
    fetchAddresses();
  }, [token]);


  const handleEdit = (addr = null) => {
    if (addr) {
      setFormValue({ ...addr });
      setEditId(addr._id);
    } else {
  
      setFormValue({
        fullname: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
      setEditId(null);
    }
    setShowModal(true);
  };


  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/address/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(addresses.filter((a) => a._id !== deleteId));
      toast.success("Address deleted successfully");
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error("Failed to delete address");
    }
  };

  // Save/Update handler
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        const res = await axios.put(`${BASE_URL}/api/address/${editId}`, formValue, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses((prev) =>
          prev.map((a) => (a._id === editId ? res.data.address : a))
        );
        toast.success("Address updated successfully");
      } else {
        // Add new
        const res = await axios.post(`${BASE_URL}/api/address`, formValue, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses([res.data.address, ...addresses]);
        toast.success("Address added successfully");
      }
      setShowModal(false);
      setEditId(null);
    } catch (err) {
      console.error("Failed to save address:", err);
      toast.error("Failed to save address");
    }
  };

  const handleChange = (e) =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  return (
    <div className="py-5 px-3 min-h-screen border-gray-300 border rounded-md font-[Quicksand]">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-600">
          Your Addresses
        </h1>
        <button
          onClick={() => handleEdit(null)}
          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <FiPlus /> Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border rounded-md p-4 shadow-sm flex flex-col justify-between gap-2 py-10 bg-[#EFF4F7]"
          >
            <div>
              <h2 className="font-semibold">{addr.fullname}</h2>
              <p>{addr.mobile}</p>
              <p>
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-3">
              <button
                onClick={() => handleEdit(addr)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 rounded-sm text-white text-sm hover:bg-blue-700 transition"
              >
                <FiEdit className="text-sm" /> Edit
              </button>
              <button
                onClick={() => handleDeleteConfirm(addr._id)}
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-red-600 rounded-sm text-white text-sm hover:bg-red-700 transition"
              >
                <FiTrash2 className="text-sm" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="bg-zinc-900 rounded-md shadow-lg p-6 w-full max-w-md text-white">
                <h2 className="text-xl font-bold mb-4">
                  {editId ? "Edit Address" : "Add Address"}
                </h2>

                <form className="grid grid-cols-1 gap-3" onSubmit={handleSave}>
                  {[
                    "fullname",
                    "mobile",
                    "address",
                    "city",
                    "state",
                    "country",
                    "pincode",
                  ].map((f) => (
                    <input
                      key={f}
                      name={f}
                      value={formValue[f]}
                      onChange={handleChange}
                      placeholder={f.toUpperCase()}
                      className="p-2 rounded border border-zinc-700 bg-zinc-800 text-white"
                      required
                    />
                  ))}
                  <div className="flex gap-3 mt-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 py-2 rounded hover:bg-blue-700 transition"
                    >
                      {editId ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-zinc-700 py-2 rounded hover:bg-zinc-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="bg-zinc-900 rounded-md shadow-lg p-6 w-full max-w-md text-white text-center">
                <h2 className="text-xl font-bold mb-4">
                  Are you sure you want to delete this address?
                </h2>
                <div className="flex gap-4 justify-center mt-3">
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="bg-zinc-700 px-6 py-2 rounded hover:bg-zinc-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllAddress;
