import Size from "../models/Size.js";

// CREATE SIZE
export const createSize = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) return res.status(400).json({ message: "Size name is required" });

    const size = await Size.create({ name });
    res.status(201).json(size);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSizes = async (req, res) => {
  try {
    const sizes = await Size.find().sort({ createdAt: -1 });
    res.status(200).json(sizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SIZE
export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const size = await Size.findByIdAndUpdate(id, { name }, { new: true });
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.status(200).json(size);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE SIZE
export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Size.findByIdAndDelete(id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.status(200).json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE STATUS
export const toggleSizeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const size = await Size.findById(id);
    if (!size) return res.status(404).json({ message: "Size not found" });

    size.status = size.status === "Active" ? "Inactive" : "Active";
    await size.save();

    res.status(200).json(size);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
