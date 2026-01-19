import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sizes = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [sizes, setSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [sizeName, setSizeName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // GET ALL SIZES
  const getSizes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/size`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSizes(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch sizes");
    }
  };

  useEffect(() => {
    getSizes();
  }, []);

  // CREATE / UPDATE SIZE
  const handleSubmit = async () => {
    if (!sizeName.trim()) return toast.warning("Enter size name");

    try {
      if (editingId) {
        const res = await axios.put(
          `${BASE_URL}/api/size/${editingId}`,
          { name: sizeName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSizes(sizes.map((s) => (s._id === editingId ? res.data : s)));
        toast.success("Size updated successfully");
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/size`,
          { name: sizeName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSizes([res.data, ...sizes]);
        toast.success("Size added successfully");
      }

      setOpenModal(false);
      setSizeName("");
      setEditingId(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // DELETE SIZE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this size?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/size/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSizes(sizes.filter((s) => s._id !== id));
      toast.success("Size deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete size");
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/size/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSizes(sizes.map((s) => (s._id === id ? res.data : s)));
      toast.success("Status updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  // EDIT SIZE
  const handleEdit = (size) => {
    setEditingId(size._id);
    setSizeName(size.name);
    setOpenModal(true);
  };

  // SEARCH + PAGINATION LOGIC
  const filteredSizes = sizes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSizes = filteredSizes.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="w-full p-4 font-[Quicksand] shadow mt-5">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold">Sizes</h1>
        <button
          onClick={() => { setOpenModal(true); setEditingId(null); setSizeName(""); }}
          className="bg-[#4AC2C4] text-white px-4 py-2 rounded shadow hover:bg-[#3cb4b6]"
        >
          + Create Size
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search sizes..."
        className="border px-3 py-2 rounded-md mb-3 w-full md:w-1/3"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
      />

      <div className="bg-white rounded-lg">
        <table className="w-full text-left mt-5">
          <thead>
            <tr className="border-b bg-zinc-950 text-white text-sm">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">Size Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSizes.map((size, index) => (
              <tr key={size._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4">{startIndex + index + 1}</td>
                <td className="py-3 px-4 font-medium capitalize">{size.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${size.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {size.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-5 text-[20px]">
                  <FiEdit onClick={() => handleEdit(size)} className="text-blue-600 cursor-pointer hover:scale-110 transition" />
                  <button onClick={() => toggleStatus(size._id)}>
                    {size.status === "Active" ? <RiLockUnlockLine className="text-green-600 cursor-pointer hover:scale-110 transition" /> : <RiLockLine className="text-red-600 cursor-pointer hover:scale-110 transition" />}
                  </button>
                  <FiTrash2 onClick={() => handleDelete(size._id)} className="text-red-500 cursor-pointer hover:scale-110 transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {startIndex + paginatedSizes.length} of {filteredSizes.length}
        </p>
        <div className="flex gap-2">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-[#4AC2C4] text-white" : ""}`}
            >
              {idx + 1}
            </button>
          ))}

          <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenModal(false)} />
            <motion.div className="fixed z-50 bg-white rounded-lg p-6 w-[90%] max-w-md top-[30%] left-[35%] shadow-lg" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Size" : "Create Size"}</h2>
                <AiOutlineClose onClick={() => setOpenModal(false)} className="text-xl cursor-pointer" />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium">Size Name</label>
                <input type="text" value={sizeName} onChange={e => setSizeName(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" placeholder="Enter size name" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-[#4AC2C4] text-white rounded">{editingId ? "Update" : "Add Size"}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sizes;
