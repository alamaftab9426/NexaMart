import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import slugify from "slugify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_API_URL;

  console.log(token)
  // MASTER DATA
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectcolor, setSelectcolor] = useState([]);

  // PRODUCT FORM
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    subCategoryId: "",
    brandId: "",
    tagId: [],
    description: [{ text: "" }],
    variants: [],
  });

  const isEditMode = Boolean(id);

  // FETCH MASTER DATA
  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchMasterData = async () => {
      try {
        const [catRes, subRes, brandRes, tagRes, sizeRes, colorRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/categories`, { headers }),
          axios.get(`${BASE_URL}/api/subcategories`, { headers }),
          axios.get(`${BASE_URL}/api/createbrand`, { headers }),
          axios.get(`${BASE_URL}/api/tags`, { headers }),
          axios.get(`${BASE_URL}/api/size`, { headers }),
          axios.get(`${BASE_URL}/api/color`, { headers }),
        ]);

        setCategories(catRes.data.filter(c => c.status === "Active"));
        setSubCategories(subRes.data.filter(s => s.status === "Active"));
        setBrands(brandRes.data.filter(b => b.status === "Active"));
        setTags(tagRes.data.filter(t => t.status === "Active"));
        setSelectedSizes(sizeRes.data.filter(s => s.status === "Active"));
        setSelectcolor(colorRes.data.filter(c => c.status === "Active"));

        if (id) fetchProduct();
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch master data");
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}`, { headers });
        const p = res.data;

        if (!p || !p._id || !Array.isArray(p.variants)) {
          toast.error("Product data corrupted");
          return;
        }

        setForm({
          name: p.name || "",
          slug: p.slug || "",
          categoryId: p.categoryId?._id || "",
          subCategoryId: p.subCategoryId?._id || "",
          brandId: p.brandId?._id || "",
          tagId: p.tagId?.map(t => t._id) || [],
          description: p.description?.map(d => ({ text: d })) || [{ text: "" }],
          variants: p.variants.map(v => ({
            color: v.color?._id || "",
            images: v.images || [],
            sizes: v.sizes.map(s => ({
              size: s.size?._id || "",
              sku: s.sku || "",
              price: s.price || "",
              oldPrice: s.oldPrice || "",
              quantity: s.quantity || ""
            }))
          }))
        });

        setSelectedTags(p.tagId?.map(t => t._id) || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product");
      }
    };

    fetchMasterData();
  }, [token, id]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setForm({ ...form, name: value, slug: slugify(value, { lower: true, strict: true }) });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  // TAGS
  const handleTagSelect = (e) => {
    const value = e.target.value;
    if (value && !selectedTags.includes(value)) {
      const updated = [...selectedTags, value];
      setSelectedTags(updated);
      setForm({ ...form, tagId: updated });
    }
  };

  const removeTag = (tagId) => {
    const updated = selectedTags.filter(t => t !== tagId);
    setSelectedTags(updated);
    setForm({ ...form, tagId: updated });
  };

  // DESCRIPTION
  const addDescription = () => setForm({ ...form, description: [...form.description, { text: "" }] });
  const updateDescription = (i, value) => {
    const updated = [...form.description];
    updated[i].text = value;
    setForm({ ...form, description: updated });
  };
  const removeDescription = (i) => {
    const updated = form.description.filter((_, idx) => idx !== i);
    setForm({ ...form, description: updated.length ? updated : [{ text: "" }] });
  };

  // VARIANTS
  const addVariant = () =>
    setForm({
      ...form,
      variants: [...form.variants, { color: "", images: [], sizes: [{ size: "", sku: "", price: "", oldPrice: "", quantity: "" }] }],
    });

  const updateVariantColor = (i, value) => {
    const updated = [...form.variants];
    updated[i].color = value;
    setForm({ ...form, variants: updated });
  };
  // IF COLOR SELECTED THEN NEXT VARIENT COLOR NOT VISIBLE 
  const usedColors = form.variants
    .map(v => v.color)
    .filter(Boolean);

  // IF COLOR SELECTED THEN NEXT VARIENT COLOR NOT VISIBLE 
  const usedSizesAllVariants = form.variants
    .flatMap(v => v.sizes.map(sz => sz.size))
    .filter(Boolean);

  // IMAGE HANDLING
  const updateVariantImages = (variantIndex, files) => {
    setForm(prev => {
      const updated = structuredClone(prev);

      const existing = updated.variants[variantIndex].images || [];

      const newFiles = Array.from(files).filter(
        file =>
          !existing.some(
            img => img instanceof File && img.name === file.name
          )
      );

      updated.variants[variantIndex].images = [
        ...existing,
        ...newFiles
      ].slice(0, 4);

      return updated;
    });
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    if (!isEditMode) {
      const updatedVariants = [...form.variants];
      updatedVariants[variantIndex].images.splice(imageIndex, 1);
      setForm({ ...form, variants: updatedVariants });
      toast.success("Image removed successfully");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    axios.patch(`${BASE_URL}/api/products/${id}/remove-variant-image`, { variantIndex, imageIndex }, { headers })
      .then(() => {
        const updatedVariants = [...form.variants];
        updatedVariants[variantIndex].images.splice(imageIndex, 1);
        setForm({ ...form, variants: updatedVariants });
        toast.success("Image removed successfully");
      })
      .catch(err => {
        console.error(err);
        toast.error("Failed to remove image");
      });
  };

  // SIZES
  const addSize = (variantIndex) => {
    const updated = [...form.variants];
    updated[variantIndex].sizes.push({ size: "", sku: "", price: "", oldPrice: "", quantity: "" });
    setForm({ ...form, variants: updated });
  };
  const updateSize = (variantIndex, sizeIndex, field, value) => {
    const updated = [...form.variants];
    updated[variantIndex].sizes[sizeIndex][field] = value;
    setForm({ ...form, variants: updated });
  };
  const removeSize = (variantIndex, sizeIndex) => {
    const updated = [...form.variants];
    updated[variantIndex].sizes = updated[variantIndex].sizes.filter((_, idx) => idx !== sizeIndex);
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (i) => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("categoryId", form.categoryId);
      formData.append("subCategoryId", form.subCategoryId);
      if (form.brandId) formData.append("brandId", form.brandId);
      formData.append("tagId", JSON.stringify(form.tagId));
      formData.append("description", JSON.stringify(form.description.map(d => d.text)));
      formData.append("variants", JSON.stringify(form.variants.map(v => ({
        color: v.color,
        sizes: v.sizes.map(s => ({
          size: s.size,
          sku: s.sku,
          price: s.price,
          oldPrice: s.oldPrice,
          quantity: s.quantity
        }))
      }))));

      form.variants.forEach((variant, vIndex) => {
        variant.images.forEach(img => {
          if (img instanceof File) {
            formData.append(`variantImages[${vIndex}]`, img);
          }
        });
      });
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };
      if (isEdit) {
        await axios.put(`${BASE_URL}/api/products/${id}`, formData, { headers });
        toast.success("Product updated!");
      } else {
        await axios.post(`${BASE_URL}/api/products`, formData, { headers });
        toast.success("Product created!");
      }
      setTimeout(() => navigate("/admin/items"), 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <button onClick={() => navigate(-1)} className="text-[#4AC2C4] underline mb-4">← Back</button>
      <h1 className="text-2xl font-semibold mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded" required />
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">Select SubCategory</option>
            {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select name="brandId" value={form.brandId} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>

        {/* TAGS */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Add Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map(tid => {
              const tag = tags.find(t => t._id === tid);
              return tag ? (
                <span key={tid} className="bg-blue-200 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  {tag.label}
                  <button type="button" onClick={() => removeTag(tid)} className="text-red-500 font-bold">×</button>
                </span>
              ) : null;
            })}
          </div>
          <select onChange={handleTagSelect} className="border p-2 rounded w-1/2" value="">
            <option value="">Select Tag</option>
            {tags.filter(t => !selectedTags.includes(t._id)).map(t => <option key={t._id} value={t._id}>{t.label}</option>)}
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          {form.description.map((d, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <textarea value={d.text} onChange={e => updateDescription(i, e.target.value)} className="border p-2 rounded w-full" />
              {i > 0 && <button type="button" onClick={() => removeDescription(i)} className="bg-red-500 text-white px-1 py-0.5 text-xs rounded">Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addDescription} className="bg-[#4AC2C4] text-white px-3 py-1 rounded">Add Description</button>
        </div>

        {/* VARIANTS */}
        <div className="border py-3 px-2 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Variants</h2>
            <button type="button" onClick={addVariant} className="bg-[#4AC2C4] text-white px-3 py-1 rounded">+ Add Variant</button>
          </div>

          {form.variants.map((v, i) => (
            <div key={i} className="border p-4 rounded mb-4 bg-gray-50">
              <select
                value={v.color}
                onChange={e => updateVariantColor(i, e.target.value)}
                className="border p-2 rounded mb-2 w-full"
              >
                <option value="">Select Color</option>
                {selectcolor
                  .filter(c =>
                    c._id === v.color ||
                    !usedColors.includes(c._id)
                  )
                  .map(c => (
                    <option key={c._id} value={c._id} className="capitalize">
                      {c.name}
                    </option>
                  ))}
              </select>


              {/* IMAGES */}
              <div className="flex gap-3 py-4">
                {v.images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                    <img
  src={
    img instanceof File
      ? URL.createObjectURL(img)
      : img.startsWith("http")
        ? img
        : `${BASE_URL}/${img}`
  } alt="" className="w-full h-full object-cover rounded" />
                    <button type="button" onClick={() => removeVariantImage(i, idx)} className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 text-white text-sm font-bold shadow hover:bg-red-700 transition">×</button>
                  </div>
                ))}
                {Array(4 - v.images.length).fill(0).map((_, emptyIdx) => (
                  <div key={`empty-${emptyIdx}`} className="relative w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        hidden
                        multiple={false}
                        onChange={e => updateVariantImages(i, e.target.files)}
                      />

                    </label>
                  </div>
                ))}
              </div>

              {/* SIZES */}
              {v.sizes.map((s, si) => (
                <div key={si} className="relative border p-2 rounded mb-2 py-8 bg-white">
                  <button type="button" onClick={() => removeSize(i, si)} className="absolute top-1 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Remove</button>
                  <div className="grid grid-cols-5 gap-2">

                    <select
                      value={s.size || ""}
                      onChange={e => updateSize(i, si, "size", e.target.value)}
                      className="border p-2 rounded"
                    >
                      <option value="">Select Size</option>

                      {selectedSizes
                       
                        .filter(size =>
                          size._id === s.size || 
                          !v.sizes.some((sz, idx) => sz.size === size._id && idx !== si)
                        )
                        .map(size => (
                          <option key={size._id} value={size._id}>
                            {size.name}
                          </option>
                        ))}
                    </select>

                    <input placeholder="SKU" value={s.sku} onChange={e => updateSize(i, si, "sku", e.target.value)} className="border p-2 rounded" />
                    <input placeholder="Price" type="number" value={s.price} onChange={e => updateSize(i, si, "price", e.target.value)} className="border p-2 rounded" />
                    <input placeholder="Old Price" type="number" value={s.oldPrice} onChange={e => updateSize(i, si, "oldPrice", e.target.value)} className="border p-2 rounded" />
                    <input placeholder="Quantity" type="number" value={s.quantity} onChange={e => updateSize(i, si, "quantity", e.target.value)} className="border p-2 rounded" />
                  </div>
                </div>
              ))}

              <div className="flex gap-3 mt-5">
                <button type="button" onClick={() => addSize(i)} className="bg-[#4AC2C4] text-white px-3 py-1 rounded mb-2">Add Size</button>
                <button type="button" onClick={() => removeVariant(i)} className="bg-red-500 text-white px-3 py-1 rounded mb-2">Remove Variant</button>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-[#4AC2C4] text-white px-6 py-2 rounded">{isEdit ? "Update Product" : "Save Product"}</button>
      </form>
    </div>
  );
};

export default AddProduct;
