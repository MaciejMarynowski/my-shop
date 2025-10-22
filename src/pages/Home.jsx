import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/products";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
    });
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, category, products]);

  return (
    <>
      <Header />

      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-center text-white rounded-b-lg mb-10 sm:p-8 max-sm:p-6">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg max-sm:text-2xl">
          Witamy w MyShop!
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-6 drop-shadow-md max-sm:text-base max-sm:px-2">
          Najlepsze oferty na elektronikę, komputery i sprzęt audio.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-cyan-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition max-sm:px-6 max-sm:py-2 max-sm:text-sm"
        >
          Zobacz teraz
        </Link>
      </section>

      {/* Products grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-20 max-sm:text-base max-sm:mt-10">
            Brak produktów spełniających kryteria.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-sm:gap-4">
            {filteredProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col max-sm:flex-row max-sm:items-center max-sm:p-2 overflow-hidden"
              >
                <img
                  src={p.imageURL}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded-t-lg max-sm:h-24 max-sm:w-24 max-sm:rounded-lg max-sm:object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between max-sm:p-2 max-sm:ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 max-sm:text-base truncate">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-cyan-600 font-bold max-sm:mt-1 max-sm:text-sm">
                    {p.price} PLN
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}