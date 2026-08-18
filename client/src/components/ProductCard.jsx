import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({
  product,
  addToCart,
  toggleWishlist,
  wishlistItems,
}) {
  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <Link to={`/product/${product.id}`}>
        <button
          style={{
            marginBottom: "10px",
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          View Details
        </button>
      </Link>

      <br />

      <button
        className="wishlist-btn"
        onClick={() => toggleWishlist(product)}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      <br />

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;