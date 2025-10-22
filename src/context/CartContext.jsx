import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      setLoading(true);
      const docRef = doc(db, "carts", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCart(docSnap.data().items || []);
      } else {
        setCart([]);
        await setDoc(docRef, { items: [] });
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) return;
    const docRef = doc(db, "carts", user.uid);
    const existing = cart.find((c) => c.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((c) =>
        c.id === product.id ? { ...c, quantity: c.quantity + quantity } : c
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }
    setCart(updatedCart);
    await updateDoc(docRef, { items: updatedCart });
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    const docRef = doc(db, "carts", user.uid);
    const updatedCart = cart.filter((c) => c.id !== productId);
    setCart(updatedCart);
    await updateDoc(docRef, { items: updatedCart });
  };

  const clearCart = async () => {
    if (!user) return;
    const docRef = doc(db, "carts", user.uid);
    setCart([]);
    await updateDoc(docRef, { items: [] });
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    const docRef = doc(db, "carts", user.uid);
    const updatedCart = cart.map((c) =>
      c.id === productId ? { ...c, quantity } : c
    );
    setCart(updatedCart);
    await updateDoc(docRef, { items: updatedCart });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}