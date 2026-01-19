import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Subcategory = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [entries] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const [subCatName, setSubCatName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [editingId, setEditingId] = useState(null); // for edit

  const [subCategories, setSubCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);

  // FETCH SubCategories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParentCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // FILTER & PAGINATION
  const filtered = subCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedData = filtered.slice(startIndex, startIndex + entries);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // OPEN MODAL FOR EDIT
  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setSubCatName(cat.name);
    setParentCategory(cat.categoryId?._id || "");
    setOpenModal(true);
  };

  // CREATE / EDIT
  const handleSubmit = async () => {
    if (!subCatName.trim()) return toast.error("Enter subcategory name");
    if (!parentCategory) return toast.error("Select parent category");

    const slug = subCatName.toLowerCase().replace(/\s+/g, "-");

    try {
      if (editingId) {
        // EDIT
        await axios.put(
          `${BASE_URL}/api/subcategories/${editingId}`,
          { name: subCatName, categoryId: parentCategory, slug },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("SubCategory updated", { autoClose: 2000, theme: "dark" });
      } else {
        // CREATE
        await axios.post(
          `${BASE_URL}/api/subcategories`,
          { name: subCatName, categoryId: parentCategory, slug },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("SubCategory added", { autoClose: 2000, theme: "dark" });
      }

      fetchSubCategories();
      setOpenModal(false);
      setSubCatName("");
      setParentCategory("");
      setEditingId(null);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong", { theme: "dark" });
    }
  };

  // DELETE with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subcategory?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully", { autoClose: 1500, theme: "dark" });
      fetchSubCategories();
    } catch (err) {
      console.log(err);
    }
  };

  // TOGGLE STATUS
  const handleStatusToggle = async (id) => {
    try {
      await axios.put(
        `${BASE_URL}/api/subcategories/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSubCategories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full p-4 font-[Quicksand] shadow mt-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold">Sub Categories</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#4AC2C4] text-white px-4 py-2 rounded shadow hover:bg-[#3cb4b6]"
        >
          + Create Sub Category
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-700">Showing {entries} entries</span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search..."
          className="border px-3 py-2 rounded-md w-[200px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg">
        <table className="w-full text-left mt-5">
          <thead>
            <tr className="border-b bg-zinc-950 text-white text-sm">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">SubCategory</th>
              <th className="py-3 px-4">Parent</th>
              <th className="py-3 px-4">CreatedAt</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((cat, index) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4">{startIndex + index + 1}</td>
                <td className="py-3 px-4 font-medium">{cat.name}</td>
                <td className="py-3 px-4 text-gray-700">{cat.categoryId?.name}</td>
                <td className="py-3 px-4">{new Date(cat.createdAt).toLocaleString()}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      cat.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                  
                </td>

                <td className="py-3 px-4 flex items-center gap-5 text-[20px]">
                  <FiEdit
                    onClick={() => openEditModal(cat)}
                    className="text-blue-600 cursor-pointer hover:scale-110 transition"
                  />
                  <button onClick={() => handleStatusToggle(cat._id)}>
                    {cat.status === "Active" ? (
                      <RiLockUnlockLine className="text-green-600 cursor-pointer hover:scale-110 transition" />
                    ) : (
                      <RiLockLine className="text-red-600 cursor-pointer hover:scale-110 transition" />
                    )}
                  </button>
                  <FiTrash2
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500 cursor-pointer hover:scale-110 transition"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1} to {Math.min(startIndex + entries, filtered.length)} of{" "}
          {filtered.length} entries
        </p>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${currentPage === 1 && "opacity-50"}`}
          >
            Previous
          </button>
          <button className="px-3 py-1 border bg-[#4AC2C4] text-white rounded">
            {currentPage}
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${currentPage === totalPages && "opacity-50"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
            />
            <motion.div
              className="fixed z-50 bg-white rounded-lg p-6 w-[90%] max-w-md top-[20%] left-[35%] shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit Sub Category" : "Create Sub Category"}
                </h2>
                <AiOutlineClose
                  onClick={() => {
                    setOpenModal(false);
                    setEditingId(null);
                  }}
                  className="text-xl cursor-pointer"
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium">SubCategory Name</label>
                <input
                  type="text"
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter name"
                />
              </div>
              <div className="mb-3">
                <label className="text-sm font-medium">Parent Category</label>
                <select
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="">Select parent</option>
                  {parentCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setOpenModal(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-[#4AC2C4] text-white rounded">
                  {editingId ? "Update" : "Add Sub Category"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Subcategory;
