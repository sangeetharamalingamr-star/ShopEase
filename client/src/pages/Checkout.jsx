import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cartItems }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "Cash on Delivery",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // PRICE CALCULATION
  // =========================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryCharge = subtotal > 0 ? 50 : 0;

  const gst = subtotal * 0.18;

  const grandTotal =
    subtotal + deliveryCharge + gst;

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Check login
    if (!user) {
      alert("Please login before placing an order.");
      navigate("/login");
      return;
    }

    // Check email
    if (!user.email) {
      alert(
        "Your account does not have an email address."
      );
      return;
    }

    // Check cart
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // SEND ORDER TO BACKEND
      // =========================

      const response = await fetch(
        "https://shopease-backend-hdgf.onrender.com/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            // USER
            userId: user.id,

            customerName: formData.name,

            customerEmail: user.email,

            // DELIVERY
            phone: formData.phone,

            address: formData.address,

            city: formData.city,

            pincode: formData.pincode,

            // PAYMENT
            paymentMethod: formData.payment,

            // PRODUCTS
            items: cartItems.map((item) => ({
              productId: item.id,
              name: item.name,
              price: Number(item.price),
              image: item.image || "",
              quantity: Number(item.quantity),
            })),

            // PRICE
            subtotal: Number(subtotal),

            discount: 0,

            deliveryCharge: Number(
              deliveryCharge
            ),

            gst: Number(gst),

            grandTotal: Number(
              grandTotal
            ),
          }),
        }
      );

      const data = await response.json();

      // =========================
      // SUCCESS
      // =========================

      if (response.ok) {
        alert(
          `🎉 Order placed successfully!

Order ID: ${data.order?.id || data.order?._id || "Created"}

📧 Confirmation email sent to:
${user.email}`
        );

        navigate("/");
      } else {
        alert(
          data.message ||
            "Failed to place order."
        );
      }
    } catch (error) {
      console.error(
        "Order Error:",
        error
      );

      alert(
        "Something went wrong while placing the order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "600px",
        margin: "30px auto",
      }}
    >
      <h1>🛍️ Checkout</h1>

      <form onSubmit={handlePlaceOrder}>

        {/* NAME */}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* PHONE */}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* ADDRESS */}

        <textarea
          name="address"
          placeholder="Full Address"
          value={formData.address}
          onChange={handleChange}
          required
          style={textareaStyle}
        />

        {/* CITY */}

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* PINCODE */}

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* PAYMENT */}

        <h3>💳 Payment Method</h3>

        <select
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

          <option value="UPI">
            UPI
          </option>

          <option value="Card">
            Credit / Debit Card
          </option>
        </select>

        <hr />

        {/* PRICE DETAILS */}

        <h3>
          Subtotal: ₹
          {subtotal.toFixed(2)}
        </h3>

        <h3>
          Delivery: ₹
          {deliveryCharge.toFixed(2)}
        </h3>

        <h3>
          GST: ₹
          {gst.toFixed(2)}
        </h3>

        <h2>
          Total: ₹
          {grandTotal.toFixed(2)}
        </h2>

        {/* PLACE ORDER */}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading
              ? "gray"
              : "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "17px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Placing Order..."
            : "🛒 Place Order"}
        </button>

      </form>
    </div>
  );
}

// =========================
// INPUT STYLE
// =========================

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
};

// =========================
// TEXTAREA STYLE
// =========================

const textareaStyle = {
  ...inputStyle,
  height: "100px",
  resize: "vertical",
};

export default Checkout;