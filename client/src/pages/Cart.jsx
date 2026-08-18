import { useState } from "react";
import { Link } from "react-router-dom";

function Cart({
  cartItems,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");

  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Apply Coupon
  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();

    if (code === "WELCOME10") {
      setDiscount(subtotal * 0.1);
      setMessage("✅ 10% Coupon Applied Successfully");
    } else if (code === "SHOP500") {
      setDiscount(500);
      setMessage("✅ ₹500 Discount Applied");
    } else {
      setDiscount(0);
      setMessage("❌ Invalid Coupon Code");
    }
  };

  // Delivery
  const deliveryCharge = subtotal > 0 ? 50 : 0;

  // Amount after discount
  const amountAfterDiscount = Math.max(
    subtotal - discount,
    0
  );

  // GST
  const gst = amountAfterDiscount * 0.18;

  // Grand Total
  const grandTotal =
    amountAfterDiscount + deliveryCharge + gst;

  // 🎁 Gift Offer
  let gift = "";

  if (subtotal >= 3000) {
    if (gender === "women") {
      gift = "👚 Free Women's Top";
    } else if (gender === "men") {
      gift = "👕 Free Men's T-Shirt";
    }
  } else if (subtotal >= 2000) {
    gift = "🎁 Free Gift Box";
  } else if (subtotal >= 1000) {
    gift = "🧸 Free Teddy Bear";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Products */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                width="120"
              />

              <h3>{item.name}</h3>

              <p>₹{item.price}</p>

              <h4>
                Quantity : {item.quantity}
              </h4>

              <button
                onClick={() =>
                  decreaseQuantity(item.id)
                }
                style={{ marginRight: "10px" }}
              >
                -
              </button>

              <button
                onClick={() =>
                  increaseQuantity(item.id)
                }
              >
                +
              </button>

              <br />
              <br />

              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <hr />

          {/* Coupon */}
          <h3>🎁 Apply Coupon</h3>

          <input
            type="text"
            placeholder="Enter Coupon"
            value={coupon}
            onChange={(e) =>
              setCoupon(e.target.value)
            }
            style={{
              padding: "10px",
              width: "220px",
            }}
          />

          <button
            onClick={applyCoupon}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
            }}
          >
            Apply
          </button>

          <p>{message}</p>

          <hr />

          {/* 🎉 Gift Section */}
          <h2>🎉 Special Offers</h2>

          {subtotal >= 3000 ? (
            <>
              <p>
                🎊 Congratulations! You have unlocked
                a special ₹3000+ gift.
              </p>

              <label>
                <strong>Select Gender:</strong>
              </label>

              <br />

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                style={{
                  padding: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="women">
                  Women
                </option>

                <option value="men">
                  Men
                </option>
              </select>

              {gender && (
                <h3>
                  🎁 Your Free Gift: {gift}
                </h3>
              )}
            </>
          ) : subtotal >= 2000 ? (
            <h3>
              🎁 Congratulations! You unlocked a
              FREE Gift Box!
            </h3>
          ) : subtotal >= 1000 ? (
            <h3>
              🧸 Congratulations! You unlocked a
              FREE Teddy Bear!
            </h3>
          ) : (
            <p>
              🛍️ Purchase ₹{(1000 - subtotal).toFixed(2)}
              {" "}more to unlock a FREE Teddy Bear!
            </p>
          )}

          <hr />

          {/* Price Summary */}
          <h3>
            Subtotal : ₹{subtotal.toFixed(2)}
          </h3>

          <h3>
            Discount : -₹{discount.toFixed(2)}
          </h3>

          <h3>
            Delivery : ₹{deliveryCharge}
          </h3>

          <h3>
            GST (18%) : ₹{gst.toFixed(2)}
          </h3>

          <h2>
            Grand Total : ₹{grandTotal.toFixed(2)}
          </h2>

          {/* Checkout */}
          <Link to="/checkout">
            <button
              style={{
                marginTop: "20px",
                background: "green",
                color: "white",
                padding: "12px 25px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;