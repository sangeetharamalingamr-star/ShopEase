const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    id: 1,
    name: "boAt Airdopes",
    price: 1999,
    category: "Electronics",
    image: "boat.jpg",
  },
  {
    id: 2,
    name: "Wireless Earbuds",
    price: 2499,
    category: "Electronics",
    image: "headphone2.jpg",
  },
  {
    id: 3,
    name: "Bluetooth Headphones",
    price: 2999,
    category: "Electronics",
    image: "headphones.jpg",
  },
  {
    id: 4,
    name: "Dell Laptop",
    price: 55999,
    category: "Electronics",
    image: "lap1.jpg",
  },
  {
    id: 5,
    name: "HP Laptop",
    price: 62999,
    category: "Electronics",
    image: "lap2.jpg",
  },
  {
    id: 6,
    name: "MacBook",
    price: 109999,
    category: "Electronics",
    image: "lap3.jpg",
  },
  {
    id: 7,
    name: "Samsung Galaxy",
    price: 19999,
    category: "Electronics",
    image: "phone1.jpg",
  },
  {
    id: 8,
    name: "Vivo Smartphone",
    price: 17999,
    category: "Electronics",
    image: "phone2.jpg",
  },
  {
    id: 9,
    name: "Redmi Phone",
    price: 14999,
    category: "Electronics",
    image: "phone3.jpg",
  },
  {
    id: 10,
    name: "Running Shoes",
    price: 2999,
    category: "Footwear",
    image: "shoes.jpg",
  },
  {
    id: 11,
    name: "Leather Shoes",
    price: 3499,
    category: "Footwear",
    image: "shoe2.jpg",
  },
  {
    id: 12,
    name: "Formal Shoes",
    price: 3999,
    category: "Footwear",
    image: "shoe3.jpg",
  },
  {
    id: 13,
    name: "Smart Watch",
    price: 3999,
    category: "Watches",
    image: "watch.jpg",
  },
  {
    id: 14,
    name: "Digital Watch",
    price: 2999,
    category: "Watches",
    image: "watch2.jpg",
  },
  {
    id: 15,
    name: "Luxury Watch",
    price: 6999,
    category: "Watches",
    image: "watch3.jpg",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("15 Products Added Successfully");

    await mongoose.connection.close();

    console.log("Database Connection Closed");
  } catch (error) {
    console.log("Error:", error.message);
  }
};

seedProducts();