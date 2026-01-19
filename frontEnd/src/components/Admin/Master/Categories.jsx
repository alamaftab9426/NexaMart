import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [entries] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Fetch categories error:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // SEARCH FILTER
  const filtered = (categories || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedData = filtered.slice(startIndex, startIndex + entries);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // CREATE / EDIT CATEGORY
  const handleSubmit = async () => {
    if (!categoryName.trim()) return toast.error("Enter category name");

    try {
      if (editId) {
      
        await axios.put(
          `${BASE_URL}/api/categories/${editId}`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category updated!", {
          position: "top-center", autoClose: 2000, transition: Slide
        });
      } else {
      
        await axios.post(
          `${BASE_URL}/api/categories`,
          { name: categoryName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category added!", {
          position: "top-center", autoClose: 2000, transition: Slide
        });
      }

      fetchCategories();
      setOpenModal(false);
      setCategoryName("");
      setEditId(null);
    } catch (error) {
      console.log("Create/Edit category error:", error);
    }
  };

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
      toast.success("Category deleted!", { position: "top-center", autoClose: 2000 });
    } catch (error) {
      console.log("Delete category error:", error);
    }
  };

  // EDIT BUTTON CLICK
  const handleEditClick = (cat) => {
    setCategoryName(cat.name);
    setEditId(cat._id);
    setOpenModal(true);
  };

 // TOGGLE STATUS
const handleStatusToggle = async (cat) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/api/categories/toggle/${cat._id}`,
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCategories();
  } catch (error) {
    console.log("Status toggle error:", error);
  }
};

  return (
    <div className="w-full p-4 font-[Quicksand] shadow mt-5">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold">Categories</h1>
        <button
          onClick={() => { setOpenModal(true); setEditId(null); setCategoryName(""); }}
          className="bg-[#4AC2C4] text-white px-4 py-2 rounded"
        >
          + Create Category
        </button>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-700">Showing {entries} entries</span>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border px-3 py-2 rounded-md w-[200px]"
        />
      </div>

      <div className="bg-white rounded-lg">
        <table className="w-full text-left mt-5">
          <thead>
            <tr className="border-b bg-zinc-950 text-white text-sm">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((cat, index) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4">{startIndex + index + 1}</td>
                <td className="py-3 px-4">{cat.name}</td>
                <td className="py-3 px-4">{new Date(cat.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${cat.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {cat.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-5 text-[20px]">
                  <FiEdit className="text-blue-600 cursor-pointer" onClick={() => handleEditClick(cat)} />
                  <button onClick={() => handleStatusToggle(cat)}>
                    {cat.status === "Active" ? <RiLockUnlockLine className="text-green-600" /> : <RiLockLine className="text-red-600" />}
                  </button>
                  <FiTrash2 onClick={() => handleDelete(cat._id)} className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <p>Showing {startIndex + 1} to {Math.min(startIndex + entries, filtered.length)} of {filtered.length} entries</p>
        <div className="flex gap-2">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded">Previous</button>
          <button className="px-3 py-1 border bg-[#4AC2C4] text-white rounded">{currentPage}</button>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenModal(false)} />
            <motion.div className="fixed z-50 bg-white rounded-lg p-6 w-[90%] max-w-md top-[20%] left-[35%] shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{editId ? "Edit Category" : "Create Category"}</h2>
                <AiOutlineClose onClick={() => setOpenModal(false)} className="text-xl cursor-pointer" />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium">Category Name</label>
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1" placeholder="Enter name" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setOpenModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-[#4AC2C4] text-white rounded">{editId ? "Update" : "Add Category"}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
};

export default Categories;
