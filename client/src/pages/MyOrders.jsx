import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("user")
    );
  } catch (error) {
    console.error(
      "User data error:",
      error
    );
  }

  // ==========================================
  // GET USER ID
  // Supports:
  // user.id
  // user._id
  // user.userId
  // ==========================================

  const userId =
    user?.id ||
    user?._id ||
    user?.userId;

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      console.log(
        "========== MY ORDERS =========="
      );

      console.log(
        "Logged-in user:",
        user
      );

      console.log(
        "User ID:",
        userId
      );

      // ========================================
      // USER NOT LOGGED IN
      // ========================================

      if (!user || !userId) {
        console.log(
          "❌ User ID not found"
        );

        setLoading(false);
        return;
      }

      try {
        // ======================================
        // API REQUEST
        // ======================================

        const url =
          `http://localhost:5000/api/orders/user/${userId}`;

        console.log(
          "Fetching:",
          url
        );

        const response =
          await fetch(url);

        console.log(
          "Response status:",
          response.status
        );

        const data =
          await response.json();

        console.log(
          "Orders API response:",
          data
        );

        // ======================================
        // SUCCESS
        // ======================================

        if (response.ok) {
          setOrders(
            data.orders || []
          );

          setError("");
        }

        // ======================================
        // API ERROR
        // ======================================

        else {
          setError(
            data.message ||
              "Failed to load orders"
          );
        }

      } catch (err) {

        console.error(
          "❌ My Orders Error:",
          err
        );

        setError(
          "Something went wrong while loading orders."
        );

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, [userId]);

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div style={pageStyle}>

        <div style={emptyBoxStyle}>

          <div
            style={{
              fontSize: "60px",
            }}
          >
            🔐
          </div>

          <h2>
            Please Login
          </h2>

          <p>
            Login to view your orders.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
            style={buttonStyle}
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // USER ID NOT FOUND
  // ==========================================

  if (!userId) {
    return (
      <div style={pageStyle}>

        <div style={emptyBoxStyle}>

          <div
            style={{
              fontSize: "60px",
            }}
          >
            ⚠️
          </div>

          <h2>
            User Information Missing
          </h2>

          <p>
            Please login again to view
            your orders.
          </p>

          <button
            onClick={() => {
              localStorage.removeItem(
                "user"
              );

              navigate("/login");
            }}
            style={buttonStyle}
          >
            Login Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={pageStyle}>

        <div style={emptyBoxStyle}>

          <div
            style={{
              fontSize: "50px",
            }}
          >
            ⏳
          </div>

          <h2>
            Loading Orders...
          </h2>

          <p>
            Please wait.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div style={pageStyle}>

        <div style={emptyBoxStyle}>

          <div
            style={{
              fontSize: "50px",
            }}
          >
            ❌
          </div>

          <h2>
            Error
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            style={buttonStyle}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // NO ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <div style={pageStyle}>

        <div style={emptyBoxStyle}>

          <div
            style={{
              fontSize: "70px",
            }}
          >
            📦
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any
            orders yet.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={buttonStyle}
          >
            🛍️ Start Shopping
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // ORDERS UI
  // ==========================================

  return (
    <div style={pageStyle}>

      <div style={containerStyle}>

        {/* ====================================
            PAGE TITLE
        ==================================== */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          📦 My Orders
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Welcome,{" "}
          <strong>
            {user.name || "Customer"}
          </strong>
        </p>

        {/* ====================================
            ORDER COUNT
        ==================================== */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
            color: "#198754",
            fontWeight: "bold",
          }}
        >
          {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </div>

        {/* ====================================
            ORDERS
        ==================================== */}

        {orders.map((order) => (

          <div
            key={order._id}
            style={orderCardStyle}
          >

            {/* ==================================
                ORDER HEADER
            ================================== */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "15px",
              }}
            >

              <div>

                <h3
                  style={{
                    margin:
                      "0 0 5px 0",
                  }}
                >
                  🛒 Order
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#666",
                    wordBreak:
                      "break-all",
                  }}
                >
                  ID:{" "}
                  {order._id}
                </p>

              </div>

              <span
                style={{
                  background:
                    "#d1e7dd",
                  color:
                    "#0f5132",
                  padding:
                    "8px 14px",
                  borderRadius:
                    "20px",
                  fontWeight:
                    "bold",
                  fontSize:
                    "14px",
                }}
              >
                ✅{" "}
                {order.status ||
                  "Order Placed"}
              </span>

            </div>

            <hr />

            {/* ==================================
                ORDER DATE + PAYMENT
            ================================== */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                flexWrap: "wrap",
                gap: "10px",
                margin:
                  "15px 0",
              }}
            >

              <p
                style={{
                  margin: 0,
                }}
              >
                📅{" "}
                <strong>
                  Order Date:
                </strong>{" "}

                {order.createdAt
                  ? new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}
              </p>

              <p
                style={{
                  margin: 0,
                }}
              >
                💳{" "}
                <strong>
                  Payment:
                </strong>{" "}

                {order.paymentMethod ||
                  "Cash on Delivery"}
              </p>

            </div>

            {/* ==================================
                PRODUCTS
            ================================== */}

            <h3>
              🛍️ Products
            </h3>

            <div>

              {order.items &&
                order.items.map(
                  (item, index) => (

                    <div
                      key={
                        item.productId ||
                        index
                      }
                      style={
                        productStyle
                      }
                    >

                      {/* PRODUCT IMAGE */}

                      <div
                        style={{
                          width:
                            "80px",
                          height:
                            "80px",
                          flexShrink: 0,
                        }}
                      >

                        {item.image ? (

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "contain",
                              borderRadius:
                                "8px",
                              border:
                                "1px solid #ddd",
                            }}
                          />

                        ) : (

                          <div
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background:
                                "#f5f5f5",
                              borderRadius:
                                "8px",
                              fontSize:
                                "30px",
                            }}
                          >
                            📦
                          </div>

                        )}

                      </div>

                      {/* PRODUCT DETAILS */}

                      <div
                        style={{
                          flex: 1,
                        }}
                      >

                        <h4
                          style={{
                            margin:
                              "0 0 8px 0",
                          }}
                        >
                          {item.name}
                        </h4>

                        <p
                          style={{
                            margin:
                              "4px 0",
                            color:
                              "#666",
                          }}
                        >
                          Quantity:{" "}
                          <strong>
                            {
                              item.quantity
                            }
                          </strong>
                        </p>

                        <p
                          style={{
                            margin:
                              "4px 0",
                            color:
                              "#198754",
                            fontWeight:
                              "bold",
                          }}
                        >
                          ₹
                          {Number(
                            item.price ||
                              0
                          ).toFixed(2)}
                        </p>

                      </div>

                    </div>

                  )
                )}

            </div>

            <hr />

            {/* ==================================
                PRICE DETAILS
            ================================== */}

            <div>

              <h3>
                💰 Price Details
              </h3>

              <div
                style={
                  priceRowStyle
                }
              >
                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {Number(
                    order.subtotal ||
                      0
                  ).toFixed(2)}
                </span>
              </div>

              <div
                style={
                  priceRowStyle
                }
              >
                <span>
                  Discount
                </span>

                <span>
                  - ₹
                  {Number(
                    order.discount ||
                      0
                  ).toFixed(2)}
                </span>
              </div>

              <div
                style={
                  priceRowStyle
                }
              >
                <span>
                  Delivery
                </span>

                <span>
                  ₹
                  {Number(
                    order.deliveryCharge ||
                      0
                  ).toFixed(2)}
                </span>
              </div>

              <div
                style={
                  priceRowStyle
                }
              >
                <span>
                  GST
                </span>

                <span>
                  ₹
                  {Number(
                    order.gst ||
                      0
                  ).toFixed(2)}
                </span>
              </div>

              <hr />

              {/* GRAND TOTAL */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  fontSize:
                    "20px",
                  fontWeight:
                    "bold",
                  color:
                    "#198754",
                }}
              >

                <span>
                  Grand Total
                </span>

                <span>
                  ₹
                  {Number(
                    order.grandTotal ||
                      0
                  ).toFixed(2)}
                </span>

              </div>

            </div>

            {/* ==================================
                DELIVERY ADDRESS
            ================================== */}

            <div
              style={{
                marginTop:
                  "20px",
                padding:
                  "15px",
                background:
                  "#f8f9fa",
                borderRadius:
                  "8px",
              }}
            >

              <h3
                style={{
                  marginTop: 0,
                }}
              >
                📍 Delivery Address
              </h3>

              <p
                style={{
                  margin:
                    "5px 0",
                }}
              >
                <strong>
                  {order.customerName}
                </strong>
              </p>

              <p
                style={{
                  margin:
                    "5px 0",
                }}
              >
                {order.address}
              </p>

              <p
                style={{
                  margin:
                    "5px 0",
                }}
              >
                {order.city} -{" "}
                {order.pincode}
              </p>

              <p
                style={{
                  margin:
                    "5px 0",
                }}
              >
                📞{" "}
                {order.phone}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const pageStyle = {
  minHeight: "100vh",
  padding: "30px 20px",
  background:
    "#f5f7fa",
  boxSizing:
    "border-box",
};

const containerStyle = {
  maxWidth:
    "900px",
  margin:
    "0 auto",
};

const orderCardStyle = {
  background:
    "white",
  padding:
    "25px",
  marginBottom:
    "25px",
  borderRadius:
    "12px",
  boxShadow:
    "0 3px 12px rgba(0,0,0,0.08)",
};

const productStyle = {
  display:
    "flex",
  alignItems:
    "center",
  gap:
    "15px",
  padding:
    "15px 0",
  borderBottom:
    "1px solid #eee",
};

const priceRowStyle = {
  display:
    "flex",
  justifyContent:
    "space-between",
  margin:
    "10px 0",
  fontSize:
    "16px",
};

const emptyBoxStyle = {
  maxWidth:
    "500px",
  margin:
    "80px auto",
  padding:
    "40px 25px",
  background:
    "white",
  borderRadius:
    "12px",
  textAlign:
    "center",
  boxShadow:
    "0 3px 12px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  padding:
    "12px 25px",
  background:
    "#198754",
  color:
    "white",
  border:
    "none",
  borderRadius:
    "6px",
  fontSize:
    "16px",
  cursor:
    "pointer",
};

export default MyOrders;