import Color from "../models/Color.js";


// CREATE COLOR
export const createColor = async (req, res) => {
  try {
    console.log(req.body); 
    const { name, code } = req.body;
    if (!name || !code) return res.status(400).json({ message: "Name and code required" });

    const newColor = await Color.create({ name, code });
    res.status(201).json(newColor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL COLORS
export const getColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ createdAt: -1 });
    res.status(200).json(colors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// UPDATE COLOR
export const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const updatedColor = await Color.findByIdAndUpdate(
      id,
      { name, code },
      { new: true }
    );

    if (!updatedColor) return res.status(404).json({ message: "Color not found" });
    res.status(200).json(updatedColor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COLOR
export const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Color.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Color not found" });
    res.status(200).json({ message: "Color deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE STATUS
export const toggleColorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findById(id);

    if (!color) return res.status(404).json({ message: "Color not found" });

    color.status = color.status === "Active" ? "Inactive" : "Active";
    await color.save();

    res.status(200).json(color);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
