const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
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
// GET /api/orders/test
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order route is working",
  });
});

// ==========================================
// CREATE ORDER
// POST /api/orders
// ==========================================

router.post("/", async (req, res) => {
  try {
    console.log("\n========== ORDER REQUEST ==========");
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

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // ==========================================
    // PREPARE ORDER ITEMS
    // ==========================================

    const orderItems = items.map((item) => ({
      productId: String(item.productId),
      name: String(item.name || ""),
      price: Number(item.price) || 0,
      image: String(item.image || ""),
      quantity: Number(item.quantity) || 1,
    }));

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const newOrder = new Order({
      userId: String(userId),
      customerName: String(customerName),
      customerEmail: String(customerEmail),
      phone: String(phone),
      address: String(address),
      city: String(city),
      pincode: String(pincode),

      paymentMethod: String(
        paymentMethod || "Cash on Delivery"
      ),

      items: orderItems,

      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      gst: Number(gst) || 0,
      grandTotal: Number(grandTotal) || 0,

      status: "Order Placed",
    });

    // ==========================================
    // SAVE TO MONGODB
    // ==========================================

    const savedOrder = await newOrder.save();

    console.log("================================");
    console.log("✅ ORDER SAVED SUCCESSFULLY");
    console.log("Order ID:", savedOrder._id);
    console.log("================================");

    // ==========================================
    // SEND EMAIL
    // ==========================================

    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS
    ) {
      try {
        const productsHTML = orderItems
          .map(
            (item) => `
              <div style="
                padding: 12px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
              ">
                <strong>${item.name}</strong>
                <br>
                Price: ₹${item.price.toFixed(2)}
                <br>
                Quantity: ${item.quantity}
              </div>
            `
          )
          .join("");

        const mailOptions = {
          from: `"ShopEase" <${process.env.EMAIL_USER}>`,
          to: customerEmail,
          subject: "ShopEase - Order Confirmation",

          html: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 650px;
              margin: auto;
              padding: 20px;
            ">

              <h2>🛍️ ShopEase Order Confirmation</h2>

              <p>
                Hello <strong>${customerName}</strong>,
              </p>

              <p>
                Thank you for your order!
                Your order has been successfully placed.
              </p>

              <hr>

              <h3>Order Details</h3>

              <p>
                <strong>Order ID:</strong>
                ${savedOrder._id}
              </p>

              <p>
                <strong>Payment Method:</strong>
                ${paymentMethod || "Cash on Delivery"}
              </p>

              <h3>Products</h3>

              ${productsHTML}

              <hr>

              <p>
                <strong>Subtotal:</strong>
                ₹${Number(subtotal || 0).toFixed(2)}
              </p>

              <p>
                <strong>Discount:</strong>
                ₹${Number(discount || 0).toFixed(2)}
              </p>

              <p>
                <strong>Delivery:</strong>
                ₹${Number(deliveryCharge || 0).toFixed(2)}
              </p>

              <p>
                <strong>GST:</strong>
                ₹${Number(gst || 0).toFixed(2)}
              </p>

              <h2>
                Grand Total:
                ₹${Number(grandTotal || 0).toFixed(2)}
              </h2>

              <hr>

              <h3>Delivery Address</h3>

              <p>
                ${address}
                <br>
                ${city} - ${pincode}
                <br>
                Phone: ${phone}
              </p>

              <p>
                Thank you for shopping with
                <strong>ShopEase</strong> ❤️
              </p>

            </div>
          `,
        };

        await transporter.sendMail(mailOptions);

        console.log("✅ Confirmation email sent");
      } catch (emailError) {
        console.log(
          "⚠️ Email sending failed:",
          emailError.message
        );
      }
    } else {
      console.log(
        "⚠️ EMAIL_USER / EMAIL_PASS not configured"
      );
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });

  } catch (error) {
    console.error("❌ ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// ==========================================
// GET USER ORDERS
// GET /api/orders/user/:userId
// ==========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = String(req.params.userId);

    console.log("========== GET USER ORDERS ==========");
    console.log("User ID:", userId);

    const orders = await Order.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders: orders,
    });

  } catch (error) {
    console.error("❌ GET ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE ORDER
// GET /api/orders/:id
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order: order,
    });

  } catch (error) {
    console.error("❌ GET ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT
// ==========================================

module.exports = router;