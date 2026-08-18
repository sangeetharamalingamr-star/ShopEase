const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    message: "Order route is working",
  });
});

// ==========================================
// GET MY ORDERS
// ==========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("========== GET USER ORDERS ==========");
    console.log("User ID:", userId);

    if (!userId || userId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Valid User ID is required",
      });
    }

    const orders = await Order.find({
      userId: String(userId),
    }).sort({
      createdAt: -1,
    });

    console.log("Orders found:", orders.length);

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log("❌ GET ORDERS ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
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

        quantity: Number(
          item.quantity || 1
        ),
      })),

      subtotal: Number(subtotal || 0),

      discount: Number(discount || 0),

      deliveryCharge: Number(
        deliveryCharge || 0
      ),

      gst: Number(gst || 0),

      grandTotal: Number(
        grandTotal || 0
      ),

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
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,

      message: "Order placed successfully",

      order: {
        id: order._id,

        status: order.status,

        total: order.grandTotal,
      },
    });
  } catch (error) {
    console.log("❌ ORDER ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Order failed",

      error: error.message,
    });
  }
});

// ==========================================
// EXPORT
// ==========================================

module.exports = router;