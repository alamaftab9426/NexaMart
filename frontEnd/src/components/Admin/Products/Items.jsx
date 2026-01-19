import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { RiDeleteBin6Line, RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import VariantModal from "./VariantModal";
import "remixicon/fonts/remixicon.css";

const Items = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        const [productRes, colorRes, sizeRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/color`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/api/size`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setProducts(productRes.data || []);
        setColors(colorRes.data || []);
        setSizes(sizeRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [BASE_URL, token]);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // STATUS TOGGLE
  const toggleStatus = async (product) => {
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.patch(
        `${BASE_URL}/api/products/${product._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, status: newStatus } : p)));
      toast.success(`Marked ${newStatus}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  // SEARCH + PAGINATION LOGIC
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="p-5 mt-5 shadow-md font-[Quicksand]">
      <ToastContainer />

      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to="/admin/items/add" className="bg-[#4AC2C4] text-white px-4 py-2 rounded">
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        className="border px-3 py-2 rounded-md mb-3 w-full md:w-1/3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* TABLE */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm [&_th]:py-5 [&_td]:py-5 [&_th]:px-3 [&_td]:px-3">
          <thead className="bg-zinc-950 text-white py-8">
            <tr>
              <th>#</th>
              <th>Colors</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Sub-Category</th>
              <th>Variants</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Old Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading ? (
              paginatedProducts.map((p, i) => {
                const totalQty = p.variants.reduce(
                  (sum, v) =>
                    sum +
                    v.sizes.reduce(
                      (s, size) => s + Number(size.quantity || 0),
                      0
                    ),
                  0
                );

                const allPrices = p.variants.flatMap((v) =>
                  v.sizes.map((s) => Number(s.price))
                );
                const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
                const maxPrice = allPrices.length ? Math.max(...allPrices) : 0;

                return (
                  <tr key={p._id} className="border-b text-center">
                    <td>{startIndex + i + 1}</td>
                    <td className="flex justify-center gap-2 py-2">
                      {p.variants.map((v, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: v.color.code }}
                          title={v.color.name}
                        />
                      ))}
                    </td>
                    <td className="font-semibold">{p.name}</td>
                    <td>{p.brandId?.name || "-"}</td>
                    <td>{p.categoryId?.name || "-"}</td>
                    <td>{p.subCategoryId?.name || "-"}</td>
                    <td
                      className="text-blue-600 cursor-pointer underline"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowVariantModal(true);
                      }}
                    >
                      {p.variants.length} View
                    </td>
                    <td>{totalQty}</td>
                    <td className="text-green-600">₹{minPrice}</td>
                    <td>₹{maxPrice}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="flex justify-center gap-3 mt-4 text-xl">
                      <i
                        className="ri-pencil-line text-blue-600 cursor-pointer"
                        onClick={() => navigate(`/admin/items/edit/${p._id}`)}
                      />
                      <RiDeleteBin6Line
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(p._id)}
                      />
                      {p.status === "Active" ? (
                        <RiLockUnlockLine
                          className="text-green-600 cursor-pointer"
                          onClick={() => toggleStatus(p)}
                        />
                      ) : (
                        <RiLockLine
                          className="text-red-600 cursor-pointer"
                          onClick={() => toggleStatus(p)}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="py-5 text-center">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-5">
        <p className="text-gray-600">
          Showing {startIndex + 1} to {startIndex + paginatedProducts.length} of {filteredProducts.length}
        </p>
        <div className="flex gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
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

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* VARIANT MODAL */}
      {showVariantModal && (
        <VariantModal
          product={selectedProduct}
          BASE_URL={BASE_URL}
          onClose={() => setShowVariantModal(false)}
          selectcolor={colors}
          selectedSizes={sizes}
        />
      )}
    </div>
  );
};

export default Items;
