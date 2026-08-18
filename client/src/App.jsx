import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";

function App() {
  // ==========================================
  // CART STATE
  // ==========================================

  const [cartItems, setCartItems] = useState([]);

  // ==========================================
  // WISHLIST STATE
  // ==========================================

  const [wishlistItems, setWishlistItems] =
    useState([]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = (id) => {
    setCartItems(
      cartItems.filter(
        (item) => item.id !== id
      )
    );
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(
      (item) => item.id === product.id
    );

    if (exists) {
      setWishlistItems(
        wishlistItems.filter(
          (item) => item.id !== product.id
        )
      );
    } else {
      setWishlistItems([
        ...wishlistItems,
        product,
      ]);
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        wishlistCount={
          wishlistItems.length
        }
      />

      <Routes>

        {/* ======================================
            HOME
        ====================================== */}

        <Route
          path="/"
          element={
            <Home
              addToCart={addToCart}
              toggleWishlist={
                toggleWishlist
              }
              wishlistItems={
                wishlistItems
              }
            />
          }
        />

        {/* ======================================
            PRODUCTS
        ====================================== */}

        <Route
          path="/products"
          element={
            <Products
              addToCart={addToCart}
              toggleWishlist={
                toggleWishlist
              }
              wishlistItems={
                wishlistItems
              }
            />
          }
        />

        {/* ======================================
            CART
        ====================================== */}

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={
                removeFromCart
              }
              increaseQuantity={
                increaseQuantity
              }
              decreaseQuantity={
                decreaseQuantity
              }
            />
          }
        />

        {/* ======================================
            PRODUCT DETAILS
        ====================================== */}

        <Route
          path="/product/:id"
          element={
            <ProductDetails />
          }
        />

        {/* ======================================
            CHECKOUT
        ====================================== */}

        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cartItems}
            />
          }
        />

        {/* ======================================
            WISHLIST
        ====================================== */}

        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlistItems={
                wishlistItems
              }
            />
          }
        />

        {/* ======================================
            REGISTER
        ====================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* ======================================
            LOGIN
        ====================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* ======================================
            MY ORDERS
        ====================================== */}

        <Route
          path="/my-orders"
          element={
            <MyOrders />
          }
        />

      </Routes>
    </>
  );
}

export default App;