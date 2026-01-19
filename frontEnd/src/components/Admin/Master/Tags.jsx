import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Tags = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [entries] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [editingId, setEditingId] = useState(null);

  
  //  GET ALL TAGS
  const getTags = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tags`, {
        headers: { Authorization: `Bearer ${token}` },
        
      });
      setTags(res.data);
    
    } catch (err) {
      console.log(err);
    }
  };
  
  

  useEffect(() => {
    getTags();
  }, []);

  //  CREATE / UPDATE TAG

  const handleSubmit = async () => {
    if (!tagName.trim()) return alert("Enter tag name");

    try {
     if (editingId) {
  const res = await axios.put(
    `${BASE_URL}/api/tags/${editingId}`,
    { label: tagName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setTags(tags.map((t) => (t._id === editingId ? res.data : t)));
}

      
      else {
        // CREATE
        const res = await axios.post(
          `${BASE_URL}/api/tags`,
          { label: tagName },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTags([res.data, ...tags]);
      }

      setOpenModal(false);
      setTagName("");
      setEditingId(null);

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };
  //  DELETE TAG

  const handleDelete = async (id) => {
    if (!confirm("Delete this tag?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTags(tags.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };


  //  TOGGLE STATUS
  
  const handleStatusToggle = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/tags/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTags(tags.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log(err);
    }
  };
  //  EDIT
  const handleEdit = (tag) => {
    setEditingId(tag._id);
    setTagName(tag.label);
    setOpenModal(true);
  };

  //  FILTER + PAGINATION
  const filtered = tags.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const paginatedData = filtered.slice(startIndex, startIndex + entries);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="w-full p-4 font-[Quicksand] shadow mt-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-semibold">Tags</h1>
        <button
          onClick={() => {
            setOpenModal(true);
            setEditingId(null);
            setTagName("");
          }}
          className="bg-[#4AC2C4] text-white px-4 py-2 rounded shadow hover:bg-[#3cb4b6]"
        >
          + Create Tag
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-700">
          Showing {entries} entries
        </span>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-md outline-none w-[200px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg">
        <table className="w-full text-left mt-5">
          <thead>
            <tr className="border-b bg-zinc-950 text-white text-sm">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-4">Tag Name</th>
              <th className="py-3 px-4">CreatedAt</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tag, index) => (
              <tr key={tag._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-3 px-4">{startIndex + index + 1}</td>
                <td className="py-3 px-4 font-medium capitalize">{tag.label}</td>
                <td className="py-3 px-4">
                  {new Date(tag.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      tag.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tag.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-5 text-[20px]">
                  <FiEdit
                    onClick={() => handleEdit(tag)}
                    className="text-blue-600 cursor-pointer hover:scale-110 transition"
                  />

                  <button onClick={() => handleStatusToggle(tag._id)}>
                    {tag.status === "Active" ? (
                      <RiLockUnlockLine className="text-green-600 cursor-pointer hover:scale-110 transition" />
                    ) : (
                      <RiLockLine className="text-red-600 cursor-pointer hover:scale-110 transition" />
                    )}
                  </button>

                  <FiTrash2
                    onClick={() => handleDelete(tag._id)}
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
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + entries, filtered.length)} of{" "}
          {filtered.length} entries
        </p>

        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded ${
              currentPage === 1 && "opacity-50"
            }`}
          >
            Previous
          </button>

          <button className="px-3 py-1 border bg-[#4AC2C4] text-white rounded">
            {currentPage}
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages && "opacity-50"
            }`}
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
              className="fixed z-50 bg-white rounded-lg p-6 w-[90%] max-w-md top-[30%]  left-[35%] shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit Tag" : "Create Tag"}
                </h2>

                <AiOutlineClose
                  onClick={() => setOpenModal(false)}
                  className="text-xl cursor-pointer"
                />
              </div>

              <div className="mb-3">
                <label className="text-sm font-medium">Tag Name</label>
                <input
                  type="text"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mt-1"
                  placeholder="Enter tag"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#4AC2C4] text-white rounded"
                >
                  {editingId ? "Update" : "Add Tag"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tags;
