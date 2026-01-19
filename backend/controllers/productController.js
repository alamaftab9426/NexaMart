import Product from "../models/Product.js";
import slugify from "slugify";
import Tag from "../models/Tag.js";


export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      tagId,
      description,
      variants
    } = req.body;

    if (!name || !categoryId || !subCategoryId || !tagId || !variants) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    /* ---------- PARSE TAGS ---------- */
    let parsedTagIds =
      typeof tagId === "string" ? JSON.parse(tagId) : tagId;

    if (!Array.isArray(parsedTagIds)) parsedTagIds = [parsedTagIds];

    /* ----------  VALIDATE TAG vs SUBCATEGORY ---------- */
    const tags = await Tag.find({ id: { $in: parsedTagIds } });

    const invalidTag = tags.find(
      t => String(t.subCategoryId) !== String(subCategoryId)
    );

    if (invalidTag) {
      return res.status(400).json({
        message: `Tag "${invalidTag.label}" does not belong to selected sub-category`
      });
    }

    /* ---------- PARSE VARIANTS ---------- */
    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    const parsedDescription =
      typeof description === "string"
        ? JSON.parse(description)
        : description || [];

    const product = new Product({
      name,
      slug,
      categoryId,
      subCategoryId,
      brandId,
      tagId: parsedTagIds,
      description: parsedDescription,
      variants: parsedVariants
    });

    /* ---------- IMAGE HANDLE ---------- */
    if (req.files?.length) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/variantImages\[(\d+)\]/);
        if (!match) return;

        const idx = Number(match[1]);
        if (!product.variants[idx]) return;

        product.variants[idx].images ??= [];
        product.variants[idx].images.push(
          `/uploads/products/${file.filename}`
        );
        product.variants[idx].images =
          product.variants[idx].images.slice(0, 4);
      });
    }

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
      const products = await Product.find({ status: "Active" }) 
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .populate("brandId", "name logo")
      .populate("tagId", "label")
      .populate("variants.color", "name code")        
      .populate("variants.sizes.size", "name")      
      .sort({ createdAt: -1 });

    const BASE_URL = process.env.BASE_URL || "http://localhost:4040";
    const safeProducts = products.map(p => {
      const prod = p.toObject();
      prod.variants = prod.variants.map(v => ({
        ...v,
        images: v.images.map(img => img.startsWith("http") ? img : `${BASE_URL}${img}`)
      }));
      return prod;
    });

    res.status(200).json(safeProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET PRODUCT BY ID

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .populate("brandId", "name logo")
      .populate("tagId", "label")
      .populate("variants.color", "name")
      .populate("variants.sizes.size", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const BASE_URL = process.env.BASE_URL || "http://localhost:4040";

    const safeProduct = product.toObject();

    safeProduct.variants = (safeProduct.variants || []).map(v => ({
      ...v,
      images: (v.images || []).map(img =>
        img.startsWith("http") ? img : `${BASE_URL}${img}`
      ),
      sizes: v.sizes || []
    }));

    res.status(200).json(safeProduct);

  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




export const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      product
    });

  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      categoryId,
      subCategoryId,
      brandId,
      tagId,
      description,
      variants
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const parsedTagIds =
      typeof tagId === "string" ? JSON.parse(tagId) : tagId;

    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true });
    product.categoryId = categoryId;
    product.subCategoryId = subCategoryId;
    product.brandId = brandId;
    product.tagId = parsedTagIds;
    product.description =
      typeof description === "string"
        ? JSON.parse(description)
        : description;

    const incomingVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;
    product.variants = incomingVariants.map((v, i) => ({
      ...v,
      images: product.variants[i]?.images || []
    }));


    if (req.files?.length) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/variantImages\[(\d+)\]/);
        if (!match) return;

        const idx = Number(match[1]);
        if (!product.variants[idx]) return;

        product.variants[idx].images.push(
          `/uploads/products/${file.filename}`
        );

        product.variants[idx].images =
          product.variants[idx].images.slice(0, 4);
      });
    }

    await product.save();

    res.json({ message: "Product updated successfully", product });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// remove image 
export const removeVariantImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantIndex, imageIndex } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variant = product.variants[variantIndex];
    if (!variant) return res.status(400).json({ message: "Variant not found" });

    variant.images.splice(imageIndex, 1);
    await product.save();

    res.json({ message: "Image removed successfully", product });
  } catch (err) {
    console.error("REMOVE VARIANT IMAGE ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

