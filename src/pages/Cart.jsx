import React from "react";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
          <Link to="/" className="text-cyan-600 hover:underline">
            ← Wróć do sklepu
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Twój koszyk</h1>
        <div className="grid gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <img src={item.imageURL} alt={item.name} className="h-20 w-20 object-contain rounded" />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-cyan-600 font-bold">{item.price} PLN</p>
                <div className="flex items-center mt-2 gap-2">
                  <label>Liczba:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                    className="w-16 border rounded p-1 text-center"
                  />
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-bold">Łącznie: {total.toFixed(2)} PLN</p>
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Wyczyść koszyk
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Przejdź do płatności
            </button>
          </div>
        </div>
      </div>
    </>
  );
}