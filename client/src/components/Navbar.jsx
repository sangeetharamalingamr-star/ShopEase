import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ cartCount, wishlistCount }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav>
      <h2>🛒 ShopEase</h2>

      <ul>
        <li>
          <Link
            to="/"
            style={{ color: "white", textDecoration: "none" }}
          >
            Home
          </Link>
        </li>

        <li>
          <Link
            to="/products"
            style={{ color: "white", textDecoration: "none" }}
          >
            Products
          </Link>
        </li>

        <li>
          <Link
            to="/wishlist"
            style={{ color: "white", textDecoration: "none" }}
          >
            ❤️ Wishlist ({wishlistCount || 0})
          </Link>
        </li>

        <li>
          <Link
            to="/cart"
            style={{ color: "white", textDecoration: "none" }}
          >
            🛒 Cart ({cartCount})
          </Link>
        </li>

        {user ? (
          <>
            <li style={{ color: "white" }}>
              👋 Hi, {user.name}
            </li>

            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                style={{ color: "white", textDecoration: "none" }}
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/register"
                style={{ color: "white", textDecoration: "none" }}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;