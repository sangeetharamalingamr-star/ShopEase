const express = require("express");
const Order = require("../models/Order");
const nodemailer = require("nodemailer");

const router = express.Router();

// ==========================================
// GMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    message: "Order route is working",
  });
});

// ==========================================
// PLACE ORDER
// ==========================================

router.post("/", async (req, res) => {
  try {
    console.log("========== ORDER REQUEST ==========");
    console.log(req.body);

    const {
      userId,
      customerName,
      customerEmail,
      phone,
      address,
      city,
      pincode,
      paymentMethod,
      items,
      subtotal,
      discount,
      deliveryCharge,
      gst,
      grandTotal,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!customerName) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        message: "Customer email is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    if (!address) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

    if (!city) {
      return res.status(400).json({
        message: "City is required",
      });
    }

    if (!pincode) {
      return res.status(400).json({
        message: "Pincode is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = new Order({
      userId: String(userId || "guest"),

      customerName: String(customerName),

      phone: String(phone),

      address: String(address),

      city: String(city),

      pincode: String(pincode),

      paymentMethod: String(
        paymentMethod || "Cash on Delivery"
      ),

      items: items.map((item) => ({
        productId: String(
          item.productId || item.id
        ),

        name: String(item.name),

        price: Number(item.price),

        image: item.image || "",

        quantity: Number(item.quantity || 1),
      })),

      subtotal: Number(subtotal || 0),

      discount: Number(discount || 0),

      deliveryCharge: Number(
        deliveryCharge || 0
      ),

      gst: Number(gst || 0),

      grandTotal: Number(grandTotal || 0),

      status: "Order Placed",
    });

    // ==========================================
    // SAVE ORDER
    // ==========================================

    await order.save();

    console.log(
      "✅ ORDER SAVED:",
      order._id
    );

    // ==========================================
    // SEND EMAIL TO CUSTOMER
    // ==========================================

    let emailSent = false;

    try {
      await transporter.sendMail({
        from: `"ShopEase" <${process.env.EMAIL_USER}>`,

        to: customerEmail,

        subject:
          "🛒 ShopEase - Order Confirmation",

        html: `
          <!DOCTYPE html>

          <html>

          <head>
            <meta charset="UTF-8" />

            <title>
              ShopEase Order Confirmation
            </title>
          </head>

          <body
            style="
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
              font-family: Arial, sans-serif;
            "
          >

            <div
              style="
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                border: 1px solid #ddd;
              "
            >

              <!-- SHOP NAME -->

              <h1
                style="
                  text-align: center;
                  color: #198754;
                "
              >
                🛒 ShopEase
              </h1>

              <!-- SUCCESS -->

              <h2
                style="
                  text-align: center;
                  color: #333;
                "
              >
                🎉 Order Placed Successfully!
              </h2>

              <!-- CUSTOMER -->

              <p>
                Hello
                <strong>
                  ${customerName}
                </strong>,
              </p>

              <p>
                Thank you for shopping with
                <strong>ShopEase</strong>.
              </p>

              <p>
                Your order has been
                successfully placed.
              </p>

              <hr />

              <!-- ORDER DETAILS -->

              <h3>
                📦 Order Details
              </h3>

              <p>
                <strong>
                  Order ID:
                </strong>

                ${order._id}
              </p>

              <p>
                <strong>
                  Customer Email:
                </strong>

                ${customerEmail}
              </p>

              <p>
                <strong>
                  Payment Method:
                </strong>

                ${paymentMethod}
              </p>

              <hr />

              <!-- PRODUCTS -->

              <h3>
                🛍️ Ordered Products
              </h3>

              ${items
                .map(
                  (item) => `
                    <div
                      style="
                        padding: 12px 0;
                        border-bottom:
                        1px solid #ddd;
                      "
                    >

                      <p
                        style="
                          margin: 5px 0;
                        "
                      >
                        <strong>
                          ${item.name}
                        </strong>
                      </p>

                      <p
                        style="
                          margin: 5px 0;
                        "
                      >
                        Quantity:
                        ${item.quantity}
                      </p>

                      <p
                        style="
                          margin: 5px 0;
                        "
                      >
                        Price:
                        ₹${Number(
                          item.price
                        ).toFixed(2)}
                      </p>

                    </div>
                  `
                )
                .join("")}

              <hr />

              <!-- PRICE -->

              <h3>
                💰 Price Details
              </h3>

              <p>
                Subtotal:

                <strong>
                  ₹${Number(
                    subtotal
                  ).toFixed(2)}
                </strong>
              </p>

              <p>
                Discount:

                <strong>
                  ₹${Number(
                    discount
                  ).toFixed(2)}
                </strong>
              </p>

              <p>
                Delivery:

                <strong>
                  ₹${Number(
                    deliveryCharge
                  ).toFixed(2)}
                </strong>
              </p>

              <p>
                GST:

                <strong>
                  ₹${Number(
                    gst
                  ).toFixed(2)}
                </strong>
              </p>

              <h2
                style="
                  color: #198754;
                "
              >
                Grand Total:

                ₹${Number(
                  grandTotal
                ).toFixed(2)}
              </h2>

              <hr />

              <!-- ADDRESS -->

              <h3>
                📍 Delivery Address
              </h3>

              <p>
                ${address}
                <br />

                ${city}
                <br />

                ${pincode}
              </p>

              <hr />

              <!-- FOOTER -->

              <p
                style="
                  text-align: center;
                  color: #666;
                "
              >
                ❤️ Thank you for shopping
                with ShopEase!
              </p>

              <p
                style="
                  text-align: center;
                  color: #999;
                  font-size: 12px;
                "
              >
                This is an automated
                order confirmation email.
              </p>

            </div>

          </body>

          </html>
        `,
      });

      emailSent = true;

      console.log(
        "📧 CONFIRMATION EMAIL SENT TO:",
        customerEmail
      );

    } catch (emailError) {

      console.log(
        "❌ EMAIL ERROR:"
      );

      console.log(
        emailError.message
      );

      emailSent = false;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,

      message:
        "Order placed successfully",

      emailSent: emailSent,

      order: {
        id: order._id,

        status: order.status,

        total: order.grandTotal,
      },
    });

  } catch (error) {

    console.log(
      "❌ ORDER ERROR:"
    );

    console.log(error);

    res.status(500).json({
      success: false,

      message: "Order failed",

      error: error.message,
    });
  }
});

// ==========================================
// GET ORDERS BY USER
// ==========================================

router.get("/user/:userId", async (req, res) => {
  try {
    console.log("========== GET USER ORDERS ==========");

    const userId = req.params.userId;

    console.log("User ID:", userId);

    // Check user ID
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find orders
    const orders = await Order.find({
      userId: String(userId),
    }).sort({
      createdAt: -1,
    });

    console.log(
      "Orders found:",
      orders.length
    );

    res.status(200).json({
      success: true,
      orders: orders,
    });

  } catch (error) {

    console.log(
      "❌ GET USER ORDERS ERROR:"
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT
// ==========================================

module.exports = router;