import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (product) => {
    const productId = product._id || product.id;

    const exists = wishlist.some(
      (item) => (item._id || item.id) === productId
    );

    if (exists) {
      toast.info("Already in wishlist ❤️", {
        position: "top-center",
        theme: "dark",
      });
      return;
    }

    setWishlist((prev) => [...prev, product]);

    toast.success("Added to wishlist ❤️", {
      position: "top-center",
      theme: "dark",
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) =>
      prev.filter((item) => (item._id || item.id) !== id)
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
