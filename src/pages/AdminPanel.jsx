import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    imageURL: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    setLoading(true);

    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: Number(newProduct.price),
        category: newProduct.category,
        description: newProduct.description,
        imageURL: newProduct.imageURL,
        createdAt: new Date(),
      });

      setNewProduct({
        name: "",
        price: "",
        category: "",
        description: "",
        imageURL: "",
      });

      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Błąd przy dodawaniu produktu:", err);
      alert(`Błąd przy dodawaniu produktu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
    await deleteDoc(doc(db, "products", id));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (!user) {
    return (
      <div className="p-10 text-center text-gray-700">
        <Header />
        <p>Musisz być zalogowany, aby zobaczyć panel administratora.</p>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="p-10 text-center text-gray-700">
        <Header />
        <p>Nie masz uprawnień administratora.</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Panel Administratora</h1>

        {/* Product form */}
        <form
          onSubmit={handleAddProduct}
          className="bg-white p-6 rounded-lg shadow mb-10 grid gap-4"
        >
          <div>
            <label className="block font-medium mb-1">Nazwa produktu</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Cena (PLN)</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Kategoria</label>
            <select
              className="border p-2 rounded w-full"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            >
              <option value="">Wybierz kategorię</option>
              <option>Komputery</option>
              <option>Telefony</option>
              <option>Audio</option>
              <option>Gaming</option>
              <option>Akcesoria</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Opis</label>
            <textarea
              className="border p-2 rounded w-full"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-medium mb-1">URL zdjęcia</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="border p-2 rounded w-full"
              value={newProduct.imageURL}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageURL: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Dodawanie..." : "Dodaj produkt"}
          </button>
        </form>

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              {p.imageURL && (
                <img
                  src={p.imageURL}
                  alt={p.name}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-600">{p.price} PLN</p>
              <p className="text-sm text-gray-500">{p.category}</p>
              <button
                onClick={() => handleDelete(p.id)}
                className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}