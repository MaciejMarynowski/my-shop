import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts } from "../services/products";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchProducts()
      .then((data) => {
        const found = data.find((p) => String(p.id) === String(id));
        setProduct(found || null);
        if (found) {
          setSuggested(
            data
              .filter((p) => p.category === found.category && p.id !== found.id)
              .slice(0, 4)
          );
        }
        if (!found) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen text-gray-700">
          <p>Ładowanie produktu...</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="flex flex-col justify-center items-center h-screen text-center text-red-600 p-6">
          <p className="mb-4 text-xl font-semibold">
            Produkt o podanym identyfikatorze nie istnieje lub został usunięty.
          </p>
          <Link
            to="/"
            className="text-cyan-600 hover:text-cyan-800 font-bold transition"
          >
            ← Powrót do sklepu
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-6 md:mt-10">
        <Link
          to="/"
          className="inline-block mb-4 md:mb-6 text-cyan-600 hover:text-cyan-800 font-semibold transition"
        >
          ← Powrót do sklepu
        </Link>

        {/* Product Card */}
        <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-6 px-4 bg-gradient-to-br from-cyan-50 via-slate-100 to-blue-50">
            <img
              src={product.imageURL}
              alt={product.name}
              className="max-h-80 w-auto object-contain rounded-lg shadow-md"
            />

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {product.isNew && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  Nowość
                </span>
              )}
              {product.promo && (
                <span className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                  Promocja
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 md:p-8 flex flex-col justify-between w-full md:w-1/2">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 text-center md:text-left">
                {product.name}
              </h2>

              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 mb-4">
                <p className="text-cyan-600 font-extrabold text-2xl">
                  {product.price} PLN
                </p>
                {product.oldPrice && (
                  <span className="text-gray-400 line-through font-medium text-lg">
                    {product.oldPrice} PLN
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed text-center md:text-left">
                {product.description}
              </p>

              {product.details && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-2 text-gray-800 text-center md:text-left">
                    Specyfikacja:
                  </h3>
                  <ul className="pl-5 list-disc text-gray-700 text-sm space-y-1">
                    {Object.entries(product.details).map(([key, value]) => (
                      <li key={key}>
                        <span className="text-gray-600 font-medium">{key}:</span>{" "}
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => addToCart(product)}
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 transition text-white font-semibold rounded-full py-3 px-6 w-full shadow text-center"
              >
                Dodaj do koszyka
              </button>
              <button className="bg-slate-200 hover:bg-slate-300 text-cyan-600 font-semibold rounded-full py-3 px-6 w-full transition shadow text-center">
                ❤️ Ulubione
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        {suggested.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center md:text-left">
              Podobne produkty
            </h3>
            <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto scrollbar-hide pb-2">
              {suggested.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/product/${prod.id}`}
                  className="flex-shrink-0 w-60 md:w-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-4 text-center"
                >
                  <img
                    src={prod.imageURL}
                    alt={prod.name}
                    className="object-contain h-32 mx-auto mb-4 rounded"
                  />
                  <h4 className="text-base font-semibold text-gray-800">
                    {prod.name}
                  </h4>
                  <p className="text-cyan-600 font-bold mt-2">{prod.price} PLN</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Opinions */}
        <section className="mt-12 mb-10">
          <h3 className="text-lg font-bold mb-4 text-gray-900 text-center md:text-left">
            Opinie klientów
          </h3>
          <div className="border rounded-md p-4 bg-slate-50 text-gray-700 text-center">
            <p className="font-semibold">Brak opinii.</p>
          </div>
        </section>
      </div>
    </>
  );
}