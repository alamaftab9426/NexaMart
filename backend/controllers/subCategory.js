import SubCategory from "../models/SubCategory.js";
import slugify from "slugify";


export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId)
      return res.status(400).json({ message: "Name & Category required" });

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await SubCategory.findOne({ slug, categoryId });
    if (exists) return res.status(400).json({ message: "SubCategory already exists" });

    const subCategory = new SubCategory({ name, slug, categoryId });
    await subCategory.save();

    res.status(201).json(subCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId", "name");
    res.json(subCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TOGGLE STATUS
export const toggleSubCategoryStatus = async (req, res) => {
  try {
    const sub = await SubCategory.findById(req.params.id);
    sub.status = sub.status === "Active" ? "Inactive" : "Active";
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const category = await SubCategory.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};