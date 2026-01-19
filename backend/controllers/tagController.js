import Tag from "../models/Tag.js";
import slugify from "slugify";


// CREATE TAG

export const createTag = async (req, res) => {
  try {
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ message: "Tag name required" });
    }

    const slug = slugify(label, { lower: true, strict: true });

    const exists = await Tag.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const tag = new Tag({ label, slug });
    await tag.save();

    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL TAGS

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TAG 
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    if (!label) {
      return res.status(400).json({ message: "Tag name required" });
    }

    const slug = slugify(label, { lower: true, strict: true });

    const tag = await Tag.findByIdAndUpdate(
      id,
      { label, slug },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }


    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE TAG

export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// TOGGLE TAG STATUS
export const toggleTagStatus = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    tag.status = tag.status === "Active" ? "Inactive" : "Active";
    await tag.save();

    res.json(tag);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
