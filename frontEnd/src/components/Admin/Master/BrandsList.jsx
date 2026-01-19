import React, { useState, useEffect } from "react";
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiLockLine,
  RiLockUnlockLine,
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const BrandList = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [logo, setLogo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


  //  GET ALL BRANDS

  const getBrands = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/createbrand`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBrands(res.data);
    } catch (err) {
      console.error("GET Error:", err);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  //   UPDATE BRAND

  const handleSave = async () => {
    if (!title.trim()) return alert("Brand name is required");

    try {
      const formData = new FormData();
      formData.append("name", title);
      if (logo) formData.append("logo", logo);

      let res;

      if (editingId) {

        res = await axios.put(
          `${BASE_URL}/api/createbrand/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBrands(brands.map((b) => (b._id === editingId ? res.data : b)));
      } else {

        res = await axios.post(`${BASE_URL}/api/createbrand`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBrands([res.data, ...brands]);
      }

      // RESET
      setOpenModal(false);
      setTitle("");
      setLogo(null);
      setEditingId(null);
    } catch (error) {
      console.error("SAVE Error:", error);
      alert("Something went wrong!");
    }
  };

  // DELETE BRAND
  const deleteBrand = async (id) => {
    if (!confirm("Delete this brand?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/createbrand/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBrands(brands.filter((b) => b._id !== id));
    } catch (err) {
      console.error("DELETE Error:", err);
    }
  };


  // TOGGLE STATUS

  const toggleStatus = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/createbrand/toggle/${id}`);

      setBrands(brands.map((b) => (b._id === id ? res.data : b)));
    } catch (err) {
      console.error("STATUS Error:", err);
    }
  };


  // EDIT MODAL OPEN

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setTitle(brand.name);
    setLogo(null);
    setOpenModal(true);
  };


  // SEARCH + PAGINATION

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);


  return (
    <div className="w-full p-5 font-[Quicksand] shadow mt-3">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[22px] font-semibold">Brands</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setLogo(null);
            setOpenModal(true);
          }}
          className="px-4 py-2 bg-[#4AC2C4] text-white rounded-md flex items-center gap-2"
        >
          <RiAddLine /> Create Brand
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded-md mb-3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* TABLE */}
      <div className="overflow-x-auto bg-white p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-white bg-zinc-950">
              <th className="py-3 px-3">#</th>
              <th className="py-3">Brand Name</th>
              <th className="py-3">Logo</th>
              <th className="py-3">Created</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((brand, index) => (
              <tr key={brand._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{startIndex + index + 1}</td>
                <td className="py-3">{brand.name}</td>

                <td className="py-3">
                  <img
                    src={`${BASE_URL}${brand.logo}`}
                    alt={brand.name}
                    className="h-16  object-contain"
                  />
                </td>

                <td className="py-3">
                  {new Date(brand.createdAt).toLocaleString()}
                </td>

                <td className="py-3 ">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${brand.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {brand.status}
                  </span>
                </td>

                <td className="py-3 flex items-center justify-center mt-6 gap-3 text-xl">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <RiEditLine />
                  </button>

                  <button
                    onClick={() => toggleStatus(brand._id)}
                    className="text-gray-700 hover:text-black"
                  >
                    {brand.status === "Active" ? (
                      <RiLockUnlockLine className="text-green-600" />
                    ) : (
                      <RiLockLine className="text-red-600" />
                    )}
                  </button>

                  <button
                    onClick={() => deleteBrand(brand._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {startIndex + paginatedData.length} of{" "}
          {filtered.length}
        </p>

        <div className="flex gap-2">
          <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 border rounded">
            Previous
          </button>
          <button className="px-3 py-1 border bg-[#4AC2C4] text-white rounded">
            {currentPage}
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-[420px] p-6 rounded-lg shadow-lg relative"
            >
              <button
                onClick={() => setOpenModal(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Brand" : "Create Brand"}
              </h3>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />

                <input
                  type="file"
                  onChange={(e) => setLogo(e.target.files[0])}
                  className="px-3 py-2 border rounded-md"
                />

                <button
                  onClick={handleSave}
                  className="bg-[#4AC2C4] text-white px-4 py-2 rounded-md hover:bg-[#35a7aa]"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandList;
