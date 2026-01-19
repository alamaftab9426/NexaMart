import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const {
    cart,
    cartOpen,
    closeCart,
    decrementQuantity,
    incrementQuantity,
    removeFromCart,
    addToCart
  } = useCart();

  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeCart}
          />

          {/* SIDEBAR */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="fixed right-0 top-0 bottom-0 w-[380px] bg-white z-50 shadow-xl flex flex-col"
          >
       
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Shopping Bag ({cart.length})
              </h2>
              <button onClick={closeCart}>✕</button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border p-2 rounded-lg"
                  >
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md mt-4"
                    />

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>

 <div className="text-sm text-gray-500 mt-1">
  Color: {item.variant?.colorName || "-"} | 
  Size: {item.variant?.sizeName || "-"}
</div>



                      {/* QUANTITY */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="px-3 py-1 bg-gray-200"
                        >
                          -
                        </button>

                        <span className="font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                          incrementQuantity(item.id)

                          }
                          className="px-3 py-1 bg-gray-200"
                        >
                          +
                        </button>
                      </div>

                 
                      <div className="mt-2 font-bold text-[#2D8C91]">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

            
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">
                    ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-black text-white py-2 rounded">
                    Checkout
                  </button>
                  <button
                    className="flex-1 border py-2 rounded"
                    onClick={() => {
                      closeCart();
                      navigate("/cartpage");
                    }}
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
