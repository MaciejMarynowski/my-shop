import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";

export default function AppRoutes() {
  const { isAdmin } = useAuth();

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          {isAdmin() && <Route path="/admin" element={<AdminPanel />} />}
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}