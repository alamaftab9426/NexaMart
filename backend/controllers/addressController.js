import Address from "../models/Address.js"


export const saveAddress = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
  return res.status(400).json({ message: "Body is empty" });
}

    const {
      fullname,
      mobile,
      city,
      pincode,
      state,
      country,
      address,
    } = req.body;

    if (!fullname || !mobile || !address || !city || !state || !pincode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAddress = await Address.create({
      user: req.user.id,
      fullname,
      mobile,
      city,
      pincode,
      state,
      country,
      address
    });

    res.status(201).json({
      success: true,
      address: newAddress
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const  getAddresses = async (req, res) => {
  try {
    let addresses;
    if (req.user.role === "admin") {      
      addresses = await Address.find().populate("user", "name email");
    } else {
      
      addresses = await Address.find({ user: req.user.id });
    }
    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }
    if (
      req.user.role !== "admin" &&
      address.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const {
      fullname,
      mobile,
      city,
      pincode,
      state,
      country,
      address: fullAddress,
    } = req.body;

    if (fullname) address.fullname = fullname;
    if (mobile) address.mobile = mobile;
    if (city) address.city = city;
    if (pincode) address.pincode = pincode;
    if (state) address.state = state;
    if (country) address.country = country;
    if (fullAddress) address.address = fullAddress;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address Updated Successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) return res.status(404).json({ message: "Address Not Found" });

   
    if (req.user.role !== "admin" && address.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await address.deleteOne();
    res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
};
