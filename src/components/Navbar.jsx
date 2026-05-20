import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../App.jsx";
import { MenuIcon, XIcon, CrossIcon } from "../assets/svg/Icons.jsx";
import cbcclogo from "../assets/images/cbcclogo.webp";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "CBCC Updates", path: "/updates" },
  { label: "CBCC Devotions", path: "/devotion" },
  {
    label: "CBCC Primer",
    children: [
      { label: "About", path: "/about" },
      { label: "Ministry", path: "/ministry" },
      { label: "Discipleship", path: "/discipleship" },
      { label: "Structure", path: "/structure" },
      { label: "Education", path: "/education" },
      { label: "Membership", path: "/membership" },
      { label: "Contact", path: "/contact" },
    ],
  },
];

export default function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, handleLogout, setShowLogin } =
    useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? "glass-dark shadow-lg shadow-navy/20 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-aqua/20 border border-aqua/40 flex items-center justify-center group-hover:bg-aqua/30 transition-colors">
              <img
                src={cbcclogo}
                alt="CBCC Logo"
                width="40"
                height="40"
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-none tracking-wide">
                CBCC
              </span>
              <p className="text-aqua/70 text-[10px] font-mono tracking-widest uppercase">
                Community Church
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => {
              if (link.children) {
                return (
                  <div key={i} className="relative group">
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
                      {link.label}
                    </button>

                    <div className="absolute top-full left-0 mt-2 w-52 bg-navy border border-white/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            pathname === child.path
                              ? "text-aqua bg-aqua/10"
                              : "text-white/70 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.path
                      ? "text-aqua bg-aqua/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="hidden sm:flex px-5 py-2 rounded-xl bg-aqua/20 border border-aqua/40 text-aqua hover:bg-aqua hover:text-navy font-medium text-sm transition-all duration-300"
            >
              Sign In
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white"
              aria-label="Open menu"
            >
              {mobileOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Glass Overlay */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />

            {/* Side Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80
        bg-gradient-to-b from-white/10 to-white/5
        backdrop-blur-xl
        border-l border-white/20
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        flex flex-col pt-24 pb-10 px-6 overflow-y-auto"
            >
              {/* Nav Links */}
              {navLinks.map((link, i) => {
                if (link.children) {
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === i ? null : i)
                        }
                        className="w-full flex justify-between items-center py-4 
                  border-b border-white/10 text-lg font-medium text-white/90"
                      >
                        {link.label}

                        <motion.span
                          animate={{ rotate: openDropdown === i ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-white/70"
                        >
                          ▼
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {openDropdown === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden pl-4"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setMobileOpen(false)}
                                className={`block py-2 text-base transition-all ${
                                  pathname === child.path
                                    ? "text-aqua"
                                    : "text-white/70 hover:text-white"
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-4 border-b border-white/10 text-lg font-medium transition-all ${
                        pathname === link.path
                          ? "text-aqua"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Bottom Actions */}
              <div className="mt-8">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setMobileOpen(false);
                      }}
                      className="w-full py-3 rounded-xl 
                bg-aqua/20 backdrop-blur-md
                text-aqua border border-aqua/30
                shadow-md
                font-medium transition-all hover:bg-aqua/30"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full py-3 rounded-xl 
                bg-white/5 backdrop-blur-md
                border border-white/20 
                text-white/80 font-medium
                hover:bg-white/10 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onLoginClick();
                      setMobileOpen(false);
                    }}
                    className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-aqua to-cyan-400
              text-navy font-semibold
              shadow-lg shadow-aqua/30
              hover:scale-[1.02]
              transition-all duration-300"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
