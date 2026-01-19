import { useWishlist } from "../context/WishlistContext";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToWishlist, wishlistItems, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlistItems.find((item) => item.id === product.id);

  return (
    <div>
      <button
        onClick={() => {
          if (isWishlisted) {
            removeFromWishlist(product.id);
          } else {
            addToWishlist(product);
          }
        }}
      >
        <FaHeart color={isWishlisted ? "red" : "gray"} />
      </button>
    </div>
  );
};
