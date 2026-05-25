import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiMessageCircle,
  FiLogOut,
  FiSettings,
  FiPackage,
} from "react-icons/fi";
import { FaPalette } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTheme } from "../../context/ThemeContext";
import { useDebounce } from "../../hooks/useDebounce";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const { theme, setTheme, THEMES } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const debouncedSearch = useDebounce(searchVal, 400);

  useEffect(() => {
    if (debouncedSearch)
      navigate(`/products?search=${encodeURIComponent(debouncedSearch)}`);
  }, [debouncedSearch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/categories", label: "Categories" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"} border-b border-gray-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ShopNow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center mr-2 relative">
            <button
              onClick={() => setThemeOpen((o) => !o)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              title="Change theme"
            >
              <FaPalette
                size={24}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{
                  color: THEMES.find((t) => t.id === theme)?.color,
                }}
              />
            </button>
            {themeOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setThemeOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-20 min-w-[160px]">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                        theme === t.id
                          ? "bg-gray-100 font-medium"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-gray-700">{t.label}</span>
                      {theme === t.id && (
                        <span className="ml-auto text-primary-600 text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors hidden md:flex"
            >
              <FiHeart className="w-5 h-5 text-gray-600" />
              {wishCount > 0 && <Badge count={wishCount} />}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && <Badge count={totalItems} />}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-20"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="font-semibold text-sm text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <DropdownItem
                            to="/profile"
                            icon={<FiUser />}
                            label="My Profile"
                            onClick={() => setProfileOpen(false)}
                          />
                          <DropdownItem
                            to="/orders"
                            icon={<FiPackage />}
                            label="My Orders"
                            onClick={() => setProfileOpen(false)}
                          />
                          <DropdownItem
                            to="/messages"
                            icon={<FiMessageCircle />}
                            label="Messages"
                            onClick={() => setProfileOpen(false)}
                          />
                          {isAdmin && (
                            <DropdownItem
                              to="/admin"
                              icon={<FiSettings />}
                              label="Admin Panel"
                              onClick={() => setProfileOpen(false)}
                            />
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setProfileOpen(false);
                              navigate("/");
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <FiLogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
            >
              {menuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 px-3 mb-2 font-medium">
                  Theme
                </p>
                <div className="flex gap-2 px-1">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setMenuOpen(false);
                      }}
                      className={`w-7 h-7 rounded-full transition-transform ${theme === t.id ? "ring-2 ring-offset-2 ring-primary-500 scale-110" : "hover:scale-110"}`}
                      style={{ backgroundColor: t.color }}
                      title={t.label}
                    />
                  ))}
                </div>
              </div>
              {!user && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 btn-secondary text-sm text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 btn-primary text-sm text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ count }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
      {count > 9 ? "9+" : count}
    </span>
  );
}

function DropdownItem({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <span className="w-4 h-4 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
}
