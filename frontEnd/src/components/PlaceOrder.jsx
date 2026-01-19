import React, { useState, useEffect, useContext, useRef } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { CartContext } from "./context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Layout from "./Layout";

const PlaceOrder = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();
  const addressFormRef = useRef(null);

  const { cart, addToCart, decrementQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [formValue, setFormValue] = useState({
    fullname: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => window.scrollTo(0, 0), []);

  // Fetch addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses || []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };
    fetchAddresses();
  }, [BASE_URL, token]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    const { fullname, mobile, address, city, state, country, pincode } = formValue;

    if (!fullname?.trim()) newErrors.fullname = "Fullname is required";
    else if (fullname.trim().length < 5) newErrors.fullname = "Fullname must be at least 5 letters";

    if (!mobile?.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Enter a valid 10-digit mobile";

    if (!address?.trim()) newErrors.address = "Address is required";
    if (!city?.trim()) newErrors.city = "City is required";
    if (!state?.trim()) newErrors.state = "State is required";
    if (!country?.trim()) newErrors.country = "Country is required";

    if (!pincode?.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save new or edit address
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && editId) {
        const res = await axios.put(`${BASE_URL}/api/address/${editId}`, formValue, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAddresses((prev) =>
          prev.map((a) => (a._id === editId ? res.data.address : a))
        );
        setSelectedAddressId(editId);
        toast.success("Address Updated!", { theme: "dark", transition: Bounce });

      } else {
        const res = await axios.post(`${BASE_URL}/api/address`, formValue, {
          headers: { Authorization: `Bearer ${token}` },
          
        });

        setAddresses((prev) => [res.data.address, ...prev]);
        setSelectedAddressId(res.data.address._id);
        toast.success("Address Saved!", { theme: "dark", transition: Bounce });
      }

      setFormValue({
        fullname: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
      setShowNewAddressForm(false);
      setIsEditing(false);
      setEditId(null);
      setErrors({});
    } catch (err) {
      console.error("Address API error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
      toast.success("Address Deleted!", { theme: "dark", transition: Bounce });
    } catch (err) {
      console.error("Delete address error:", err.response?.data || err.message);
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (addr) => {
    const { fullname, mobile, address, city, state, country, pincode, _id } = addr;
    setFormValue({ fullname, mobile, address, city, state, country, pincode });
    setIsEditing(true);
    setEditId(_id);
    setShowNewAddressForm(true);
    setTimeout(() => {
      addressFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleIncrement = (item) => addToCart(item);
  const handleDecrement = (item) => decrementQuantity(item.id);
  const handleRemove = (item) => removeFromCart(item.id);

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const totalAmount = subTotal + deliveryCharge;

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      toast.info("Please select delivery address first", { theme: "dark" });
      return;
    }
    setShowPaymentModal(true);
  };

const handleConfirmOrder = async () => {
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  if (!paymentMethod) {
    toast.error("Please select a payment method!");
    return;
  }
  if (!selectedAddress) {
    toast.error("Please select an address!");
    return;
  }

  // Backend expects colorId & sizeId
  const orderPayload = {
    deliveryAddress: selectedAddress,
    paymentMethod,
    items: cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      variant: {
        colorId: item.variant.colorId, 
        sizeId: item.variant.sizeId,  
      }
    }))
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
    },
      
    });

    // Success toast
    toast.success("Order Placed Successfully!", { position: "top-center", autoClose: 3000, theme: "dark" });
    setTimeout(() => {
      navigate("/myorders", {
        state: { orderId: response.data.orderId, totalAmount: response.data.totalAmount }
      });
    }, 3000);

    setTimeout(() => {
      clearCart();
    }, 4000);

  } catch (err) {
    console.error("Order placement failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Failed to place order");
  }
};



  if (cart.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[300px] md:h-[600px]">
        <FiShoppingCart size={60} className="mb-4" />
        <h2 className="text-2xl mb-4">Your Cart is Empty</h2>
        <button onClick={() => navigate("/")} className="bg-[#DC2626] px-6 py-2 rounded text-white">
          Shop Now
        </button>
      </div>
    );


  return (
    <Layout>
      {/* Page Header */}
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img src="./images/bgcat.png" alt="Cart Banner" className="w-full h-[160px] md:h-[250px] object-cover" />
        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>
        <img src="./images/left.png" alt="Left Decoration" className="absolute left-0 bottom-0 w-[140px] md:w-[250px] object-contain" />
        <img src="./images/right.png" alt="Right Decoration" className="absolute right-0 bottom-0 w-[140px] md:w-[250px] object-contain" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">Check Out</h1>
          <p className="text-base font-[Poppins]">
            <Link to="/" className="text-[#4B9097]">Home</Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Check Out Page</span>
          </p>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="bg-white min-h-screen relative mt-6 px-4 md:px-28 pt-10 pb-20 font-[Quicksand]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">

            {/* Login */}
            <div className="rounded-lg p-4 border bg-[#F7FAFB]">
              <h2 className="font-semibold"><span className="text-blue-500 font-bold">1</span> LOGIN</h2>
              <p className="mt-2">aftab alam • +91 8853424605 ✓</p>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-4 border mt-5">
              <h2 className="font-semibold mb-3"><span className="text-blue-500 font-bold">2</span> DELIVERY ADDRESS</h2>
              {!showAddressList && selectedAddressId ? (
                addresses.filter((a) => a._id === selectedAddressId).map((a) => (
                  <div key={a._id} className="border border-blue-500 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{a.fullname} • {a.mobile} ✓</p>
                      <p className="text-zinc-700">{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                    </div>
                    <button onClick={() => setShowAddressList(true)} className="text-blue-700">CHANGE</button>
                  </div>
                ))
              ) : (
                <>
                  {addresses.map((a) => (
                    <div key={a._id} className={`border rounded-lg p-4 mb-3 ${selectedAddressId === a._id ? "border-blue-500" : "border-zinc-700"}`}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" checked={selectedAddressId === a._id} onChange={() => setSelectedAddressId(a._id)} />
                        <div>
                          <p className="font-semibold">{a.fullname} • {a.mobile}</p>
                          <p>{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                        </div>
                      </label>
                      <div className="flex gap-3 mt-2">
                        <button onClick={() => handleEditAddress(a)} className="text-blue-700 font-semibold">Edit</button>
                        <button onClick={() => handleDeleteAddress(a._id)} className="text-red-700 font-semibold">Delete</button>
                      </div>
                      {selectedAddressId === a._id && (
                        <div className="mt-3">
                          <button onClick={() => setShowAddressList(false)} className="bg-white text-[#2D8C91] px-2 py-1 rounded-md border-2 border-dotted border-[#2d8c91]">Deliver Here</button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add new */}
                  <div className="mt-5 border-t border-zinc-700 pt-4">
                    <p onClick={() => {
                      setShowNewAddressForm(!showNewAddressForm);
                      setIsEditing(false);
                      setFormValue({ fullname: "", mobile: "", address: "", city: "", state: "", country: "", pincode: "" });
                    }} className="font-semibold text-blue-700 cursor-pointer">
                      + {showNewAddressForm ? "Cancel" : "ADD A NEW ADDRESS"}
                    </p>

                    {showNewAddressForm && (
                      <form onSubmit={handleSaveAddress} ref={addressFormRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {["fullname", "mobile", "address", "city", "state", "country", "pincode"].map((f) => (
                          <div key={f} className="flex flex-col">
                            <input name={f} value={formValue[f]} onChange={handleChange} placeholder={f} className="p-2 rounded border uppercase" />
                            {errors[f] && <span className="text-red-500 text-xs mt-1">{errors[f]}</span>}
                          </div>
                        ))}
                        <div className="col-span-2 flex gap-4 mt-2">
                          <button type="submit" className="flex-1 bg-[#2D8C91] text-white py-2 rounded">{isEditing ? "UPDATE" : "SAVE AND DELIVER HERE"}</button>
                          <button type="button" onClick={() => setShowNewAddressForm(false)} className="flex-1 bg-zinc-700 text-white py-2 rounded">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="rounded-lg p-4 border mt-4">
              <h2 className="font-semibold mb-3 border-b pb-2"><span className="text-blue-500 font-bold">3</span> ORDER SUMMARY</h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 items-start border-b border-gray-200 pb-6"
                  >
                    {/* Product Image + Quantity */}
                    <div className="w-28 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-lg border overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3 border rounded-lg px-2 py-1">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="px-2 text-lg font-semibold hover:text-red-600"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="px-2 text-lg font-semibold hover:text-green-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-md font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      {/* Size & Color */}
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span>
                          <strong>Size:</strong> {item.variant?.sizeName || "-"}
                        </span>
                        <span>
                          <strong>Color:</strong>{item.variant?.colorName || "-"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 mt-3">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                        {item.oldPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ₹{item.oldPrice}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-xs font-semibold text-red-600 hover:underline mt-3"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={handleContinueToPayment} className="bg-[#2D8C91] px-6 py-2 rounded text-white">Continue</button>
              </div>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-[#F7FAFB] p-6 rounded-2xl h-max border mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
            <p className="text-sm text-gray-500 mb-4">Enter your destination to get a shipping estimate</p>

            <label className="text-sm font-semibold">Country *</label>
            <select className="w-full mt-1 mb-4 border rounded-lg p-2 text-gray-700">
              <option>India</option>
   
            </select>

            <label className="text-sm font-semibold">State/Province</label>
            <select className="w-full mt-1 mb-4 border rounded-lg p-2 text-gray-700">
              <option>Please Select a region</option>
              <option>Uttar Pradesh</option>
              
            </select>

            <label className="text-sm font-semibold">Zip/Postal Code</label>
            <input type="text" placeholder="Zip/Postal Code" className="w-full mt-1 mb-4 border rounded-lg p-2" />

            <div className="border-t pt-4 text-gray-700">
              <div className="flex justify-between py-1"><span>Sub-Total</span><span>₹ {subTotal.toFixed(2)}</span></div>
              <div className="flex justify-between py-1"><span>Delivery Charges</span><span>₹ {deliveryCharge.toFixed(2)}</span></div>
              <div className="flex justify-between py-1"><span>Coupon Discount</span><span className="text-[#4B9097] cursor-pointer">Apply Coupon</span></div>
              <div className="flex justify-between py-3 text-lg font-semibold border-t mt-2"><span>Total Amount</span><span>₹ {totalAmount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="bg-white p-6 rounded-lg w-[90%] max-w-md" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
              <h2 className="font-bold text-xl mb-4">Select Payment Method</h2>
              <div className="flex flex-col gap-3">
                {["UPI", "Credit/Debit Card", "Net Banking", "COD"].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer border p-2 rounded">
                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                    {method}
                  </label>
                ))}
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => setShowPaymentModal(false)} className="bg-zinc-700 text-white px-4 py-2 rounded">Cancel</button>
                <button onClick={handleConfirmOrder} className="bg-[#2D8C91] text-white px-4 py-2 rounded">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </Layout>
  );
};

export default PlaceOrder;
