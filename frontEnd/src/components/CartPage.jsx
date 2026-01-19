import React, { useEffect } from "react";
import Layout from "./Layout";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { Truck, Headphones, RefreshCcw, ShieldCheck } from "lucide-react";
import { useCart } from "./context/CartContext";
import { BsCartX } from "react-icons/bs";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

const CartPage = () => {
  const { cart, decrementQuantity, incrementQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 50 : 0;
  const totalAmount = subTotal + deliveryCharge;

  const { user } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCheckout = () => {
  if (!user) {
    alert("Please login first to continue checkout");
    navigate("/login");
    return;
  }

  navigate("/checkout");
};


  return (
    <Layout>
      {/* TOP BANNER */}
      <div className="relative w-full overflow-hidden font-[Quicksand]">
        <img src="./images/bgcat.png" alt="Cart Banner" className="w-full h-[160px] md:h-[250px] object-cover" />
        <div className="absolute inset-0 bg-[#EFF4F7]/35"></div>
        <img src="./images/left.png" alt="Left Decoration" className="absolute left-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInLeft" />
        <img src="./images/right.png" alt="Right Decoration" className="absolute right-0 bottom-0 w-[140px] md:w-[250px] object-contain animate__animated animate__fadeInRight" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-500">Cart Page</h1>
          <p className="text-base font-[Poppins]">
            <Link to="/" className="text-[#4B9097]">Home</Link>
            <span className="text-gray-500 mx-2">&gt;&gt;</span>
            <span className="text-gray-500">Cart Page</span>
          </p>
        </div>
      </div>

      {/* CART + SUMMARY */}
      <div className="w-full px-4 md:px-28 pt-3 md:pt-10 pb-20 font-[Quicksand] bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <div className="grid grid-cols-4 py-3 px-2 rounded-lg bg-[#F7FAFB] font-semibold text-gray-700 border">
              <p className="col-span-2">Product</p>
              <p className="text-center">Price</p>
              <p className="text-center pr-5">Total</p>
            </div>

            {/* PRODUCT LIST AREA */}
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 md:py-20 text-center col-span-5">
                <BsCartX className="text-5xl md:text-7xl" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-700 mt-4">Your Cart is Empty!</h2>
                <p className="text-gray-500 mt-1 text-sm md:text-md">Looks like you haven't added anything yet.</p>
                <Link to="/category" className="mt-4 bg-[#2D8C91] text-white px-3 text-sm md:text-md md:px-6 py-2 rounded-md hover:bg-[#246e73]">
                  Shop Now
                </Link>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 items-center border-b py-4">
                    {/* PRODUCT COLUMN */}
                    <div className="col-span-2 flex gap-4">
                      <div className="flex flex-col items-center">
                        <img
                           src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-contain rounded-lg"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="px-2 md:px-3 py-0 md:py-1 bg-gray-200 hover:bg-gray-300 text-lg rounded-full"
                          >
                            -
                          </button>
                          <span className="px-2 md:px-3 py-0 md:py-1 border rounded-md bg-gray-100 font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              incrementQuantity(item.id)

                            }
                            className="px-2 md:px-3 py-0 md:py-1 bg-gray-200 hover:bg-gray-300 text-lg rounded-full"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start gap-1 mt-2">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-md text-gray-600">
                          Size: <span className="font-semibold">{item.variant?.sizeName || "-"} </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Color: <span className="font-semibold">{item.variant?.colorName || "-"}</span>
                        </p>
                      </div>
                    </div>

                    {/* PRICE COLUMN */}
                    <div className="text-center flex flex-col items-center -mt-14">
                      <span className="text-[#2D8C91] font-bold text-lg">₹{item.price}</span>
                      <p className="line-through text-sm text-gray-500">₹{item.oldPrice}</p>
                    </div>

                    {/* TOTAL + DELETE */}
                    <div className="flex justify-between items-center md:pr-4 -mt-20">
                      <p className="font-bold text-gray-800 text-lg pl-3 md:pl-16">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <FiTrash2
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-500 cursor-pointer text-xl mt-24 md:mt-0"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="mt-10 flex justify-between items-center">
              <Link to="/category" className="text-md md:text-xl text-gray-600 underline">Continue Shopping</Link>
              <button
                onClick={handleCheckout}
                className="bg-white text-[#2D8C91] px-2 py-2 md:px-4 md:py-2 text-sm md:text-md font-semibold rounded-md hover:bg-[#2D8C91] hover:text-white border-2 border-dotted border-[#2d8c91]"
              >
                Check Out
              </button>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-[#F7FAFB] p-6 rounded-2xl -mt-[40px] md:mt-6 mx-4 md:mx-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
            <div className="border-t pt-4 text-gray-700 text-md md:text-md">
              <div className="flex justify-between py-1">
                <span>Sub-Total</span>
                <span>₹ {subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Delivery Charges</span>
                <span>₹ {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Coupon Discount</span>
                <span className="text-[#4B9097] cursor-pointer">Apply Coupon</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold text-gray-900 border-t mt-3">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-4 py-3 md:py-3 border rounded-xl font-semibold bg-[#2D8C91] text-white shadow-sm text-center block"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>

        {/* SUPPORT SECTION */}
        <section className="bg-[#F7FAFB] mx-4 md:mx-0 py-16 px-6 md:px-16 mt-12 rounded-2xl shadow-sm border border-dashed border-[#BFD8DB] font-[Quicksand]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Truck className="text-[#4B9097]" size={32} />, title: "Free Shipping", desc: "Free shipping on all US orders or orders above ₹2000" },
              { icon: <Headphones className="text-[#4B9097]" size={32} />, title: "24x7 Support", desc: "Contact us 24 hours live support, 7 days a week" },
              { icon: <RefreshCcw className="text-[#4B9097]" size={32} />, title: "30 Days Return", desc: "Simply return it within 30 days for an exchange" },
              { icon: <ShieldCheck className="text-[#4B9097]" size={32} />, title: "Payment Secure", desc: "Your payments are safe and protected" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center space-y-3 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-white w-16 h-16 flex items-center justify-center rounded-full shadow-sm border border-[#DDECEC]">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-500">{item.title}</h3>
                <p className="text-md text-gray-500 max-w-[220px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CartPage;
