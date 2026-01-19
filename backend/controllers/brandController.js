// controllers/brandController.js
import Brand from "../models/Brand.js";
import slugify from "slugify";


export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Brand name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Brand.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Brand already exists" });
    }

    const brand = new Brand({
      name,
      slug,
      logo: req.file ? `/uploads/brands/${req.file.filename}` : null,
    });

    await brand.save();
    return res.status(201).json(brand);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET ALL BRANDS
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedData = {};

    if (name) {
      updatedData.name = name;
      updatedData.slug = slugify(name, { lower: true, strict: true });
    }

    if (req.file) {
      updatedData.logo = `/uploads/brands/${req.file.filename}`;
    }

    const brand = await Brand.findByIdAndUpdate(id, updatedData, { new: true });

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const toggleBrandStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    brand.status = brand.status === "Active" ? "Inactive" : "Active";
    await brand.save();

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
