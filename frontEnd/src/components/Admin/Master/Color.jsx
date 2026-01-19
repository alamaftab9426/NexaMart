import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Colors = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [colors, setColors] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorCode, setColorCode] = useState("#000000");
  const [editingId, setEditingId] = useState(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // GET ALL COLORS
  const getColors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/color`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColors(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch colors");
    }
  };

  useEffect(() => {
    getColors();
  }, []);

  // CREATE / UPDATE COLOR
  const handleSubmit = async () => {
    if (!colorName.trim()) return toast.warning("Enter color name");

    try {
      if (editingId) {
        const res = await axios.put(
          `${BASE_URL}/api/color/${editingId}`,
          { name: colorName, code: colorCode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setColors(colors.map((c) => (c._id === editingId ? res.data : c)));
        toast.success("Color updated successfully");
      } else {
        const res = await axios.post(
          `${BASE_URL}/api/color`,
          { name: colorName, code: colorCode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setColors([res.data, ...colors]);
        toast.success("Color added successfully");
      }

      setOpenModal(false);
      setColorName("");
      setColorCode("#000000");
      setEditingId(null);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // DELETE COLOR
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this color?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/color/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColors(colors.filter((c) => c._id !== id));
      toast.success("Color deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete color");
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/color/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColors(colors.map((c) => (c._id === id ? res.data : c)));
      toast.success("Status updated");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update status");
    }
  };

  // EDIT COLOR
  const handleEdit = (color) => {
    setEditingId(color._id);
    setColorName(color.name);
    setColorCode(color.code);
    setOpenModal(true);
  };

  // SEARCH + PAGINATION LOGIC
  const filteredColors = colors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredColors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedColors = filteredColors.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="w-full p-4 font-[Quicksand] shadow mt-5">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold">Colors</h1>
        <button
          onClick={() => { setOpenModal(true); setEditingId(null); setColorName(""); setColorCode("#000000"); }}
          className="bg-[#4AC2C4] text-white px-4 py-2 rounded shadow hover:bg-[#3cb4b6]"
        >
          + Create Color
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search colors..."
        className="border px-3 py-2 rounded-md mb-3 w-full md:w-1/3"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
      />

      <div className="bg-white rounded-lg">
        <table className="w-full text-left mt-5">
          <thead>
            <tr className="border-b bg-zinc-950 text-white text-sm">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">Color Name</th>
              <th className="py-3 px-4">Color Code</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedColors.map((color, index) => (
              <tr key={color._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4">{startIndex + index + 1}</td>
                <td className="py-3 px-4 font-medium capitalize">{color.name}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: color.code }} />
                  <span>{color.code}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${color.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {color.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-5 text-[20px]">
                  <FiEdit onClick={() => handleEdit(color)} className="text-blue-600 cursor-pointer hover:scale-110 transition" />
                  <button onClick={() => toggleStatus(color._id)}>
                    {color.status === "Active" ? <RiLockUnlockLine className="text-green-600 cursor-pointer hover:scale-110 transition" /> : <RiLockLine className="text-red-600 cursor-pointer hover:scale-110 transition" />}
                  </button>
                  <FiTrash2 onClick={() => handleDelete(color._id)} className="text-red-500 cursor-pointer hover:scale-110 transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {startIndex + paginatedColors.length} of {filteredColors.length}
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
            <motion.div className="fixed z-50 bg-white rounded-lg p-6 w-[90%] max-w-2xl top-[18%] left-[26%]  shadow-lg" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{editingId ? "Edit Color" : "Create Color"}</h2>
                <AiOutlineClose onClick={() => setOpenModal(false)} className="text-xl cursor-pointer" />
              </div>

              <div className="mb-3">
                <label className="text-sm font-medium">Color Name</label>
                <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" placeholder="Enter color name" />
              </div>

              {/* Two-column: Color Picker + Code Input */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Pick Color</label>
                  <HexColorPicker color={colorCode} onChange={setColorCode} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Color Code</label>
                  <input type="text" value={colorCode} onChange={(e) => setColorCode(e.target.value)} className="w-full border px-3 py-2 rounded mt-1" />
                  <div className="mt2 w-full h-6 rounded border" style={{ backgroundColor: colorCode }}></div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-[#4AC2C4] text-white rounded">{editingId ? "Update" : "Add Color"}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Colors;
