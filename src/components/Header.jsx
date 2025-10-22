import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    {
      name: "Laptopy i komputery",
      path: "/category/laptops",
      subcategories: [
        { name: "Laptopy/Notebooki/Ultrabooki", path: "/category/laptops/notebooks" },
        { name: "Laptopy 2 w 1", path: "/category/laptops/2in1" },
        { name: "Laptopy biznesowe", path: "/category/laptops/business" },
        { name: "Komputery stacjonarne", path: "/category/computers/desktop" },
      ],
    },
    {
      name: "Smartfony i tablety",
      path: "/category/phones",
      subcategories: [
        { name: "Smartfony", path: "/category/phones/smartphones" },
        { name: "Tablety", path: "/category/phones/tablets" },
        { name: "Akcesoria GSM", path: "/category/phones/accessories" },
      ],
    },
    {
      name: "Gaming",
      path: "/category/gaming",
      subcategories: [
        { name: "Laptopy gamingowe", path: "/category/gaming/laptops" },
        { name: "Komputery gamingowe", path: "/category/gaming/desktops" },
        { name: "Monitory", path: "/category/gaming/monitors" },
        { name: "Klawiatury i myszki", path: "/category/gaming/peripherals" },
      ],
    },
    {
      name: "Akcesoria",
      path: "/category/accessories",
      subcategories: [
        { name: "Torby i plecaki", path: "/category/accessories/bags" },
        { name: "Stacje dokujące", path: "/category/accessories/docking" },
        { name: "Kable i adaptery", path: "/category/accessories/cables" },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Błąd wylogowania:", err);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between p-4 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent select-none flex-shrink-0"
        >
          MyShop
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none ml-auto"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 flex-shrink-0 ml-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setOpenMenu(idx)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                to={cat.path}
                className={`font-semibold px-2 py-1 inline-block transition ${
                  openMenu === idx ? "text-cyan-400" : "hover:text-cyan-400"
                }`}
              >
                {cat.name}
              </Link>

              <div
                className={`absolute left-0 top-full mt-1 bg-slate-900 rounded-md shadow-lg py-2 w-56 border border-slate-700 z-50 transform transition-all duration-300 ease-out ${
                  openMenu === idx
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-3 pointer-events-none"
                }`}
              >
                {cat.subcategories.map((subcat, i) => (
                  <Link
                    key={i}
                    to={subcat.path}
                    className="block px-4 py-2 text-sm hover:bg-cyan-700 transition"
                  >
                    {subcat.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="rounded-full py-2 px-3 w-48 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
          />

          {user && (
            <Link
              to="/cart"
              className="relative bg-cyan-500 hover:bg-cyan-600 transition rounded-full px-3 py-2 font-semibold text-slate-900"
            >
              Koszyk
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              <span
                className="hidden md:inline-block text-sm text-gray-300 max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap"
                title={user.email}
              >
                Witaj, {user.email}
              </span>
              {isAdmin() && (
                <Link
                  to="/admin"
                  className="bg-purple-600 hover:bg-purple-700 transition rounded-full px-3 py-2 font-semibold text-sm md:text-base"
                >
                  Panel Admina
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-cyan-500 hover:bg-cyan-600 transition rounded-full px-3 py-2 font-semibold text-slate-900 text-sm md:text-base"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-cyan-500 hover:bg-cyan-600 transition rounded-full px-3 py-2 font-semibold text-slate-900 text-sm md:text-base"
              >
                Zaloguj się
              </Link>
              <Link
                to="/register"
                className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 transition rounded-full px-3 py-2 font-semibold text-sm md:text-base"
              >
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 p-4 space-y-4 animate-slide-down">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full rounded-md py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Categories */}
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <details key={idx} className="bg-slate-800 rounded-md">
                <summary className="cursor-pointer py-2 px-3 font-semibold text-cyan-400">
                  {cat.name}
                </summary>
                <div className="pl-5 pb-2">
                  {cat.subcategories.map((subcat, i) => (
                    <Link
                      key={i}
                      to={subcat.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 text-sm text-gray-300 hover:text-cyan-400"
                    >
                      {subcat.name}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* User section (mobile) */}
          <div className="border-t border-slate-700 pt-4 space-y-3">
            {user ? (
              <>
                <p className="text-sm text-gray-300">Witaj, {user.email}</p>

                {isAdmin() && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-purple-600 hover:bg-purple-700 rounded-md px-3 py-2 font-semibold text-center"
                  >
                    Panel Admina
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-md px-3 py-2 font-semibold text-slate-900"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-cyan-500 hover:bg-cyan-600 rounded-md px-3 py-2 font-semibold text-center text-slate-900"
                >
                  Zaloguj się
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2 font-semibold text-center"
                >
                  Zarejestruj się
                </Link>
              </>
            )}

            {user && (
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="relative block bg-cyan-600 hover:bg-cyan-700 rounded-md px-3 py-2 font-semibold text-center text-slate-900"
              >
                Koszyk
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}