import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const closeCart = () => setCartOpen(false);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (product) => {
    if (!product.selectedColor || !product.selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    const variant = product.variants.find(
      (v) => v.color._id === product.selectedColor
    );
    if (!variant) return toast.error("Invalid color");

    const sizeObj = variant.sizes.find(
      (s) => s.size._id === product.selectedSize
    );
    if (!sizeObj) return toast.error("Invalid size");

    const cartItem = {
      id: `${product._id}-${variant.color._id}-${sizeObj.size._id}`, 
      productId: product._id,
      name: product.name,

      image: typeof variant.images?.[0] === "string"
        ? variant.images[0]
        : variant.images?.[0]?.url || "",

      variant: {
        colorId: variant.color._id,    
        colorName: variant.color.name, 
        sizeId: sizeObj.size._id,
        sizeName: sizeObj.size.name,
      },

      price: sizeObj.price,
      oldPrice: sizeObj.oldPrice || 0,
      quantity: 1,
    };

    setCart((prev) => {
      const exist = prev.find((i) => i.id === cartItem.id);
      if (exist) {
        return prev.map((i) =>
          i.id === cartItem.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, cartItem];
    });

    setCartOpen(true);
    toast.success("Product added to cart");
  };

  /* ---------------- QTY ---------------- */
  const decrementQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const incrementQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decrementQuantity,
        incrementQuantity,
        removeFromCart,
        clearCart,
        cartOpen,
        setCartOpen,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
