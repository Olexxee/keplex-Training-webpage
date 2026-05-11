import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";

import KeplexImage from "../utils/KeplexImage";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(0);

  const isHomePage = location.pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;

    const goingDown = diff > 5;
    const goingUp = diff < -10;

    if (goingDown && latest > 100) {
      setHidden(true);
    } else if (goingUp) {
      setHidden(false);
    }

    lastScrollY.current = latest;
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    document.documentElement.style.overflow = menuOpen
      ? "hidden"
      : "auto";
  }, [menuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleScrollTo = (id) => {
    if (!isHomePage) {
      navigate("/");
      return;
    }

    const el = document.querySelector(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        setMenuOpen(false);
      }, 200);
    }
  };

  const navLinks = [
    {
      label: "Catalog",
      path: "/catalog",
    },

    {
      label: "About",
      section: "#about",
    },

    {
      label: "Features",
      section: "#features",
    },

    {
      label: "Register",
      section: "#registration",
    },
  ];

  const NavLinkButton = ({ item }) => {
    if (item.path) {
      return (
        <Link
          to={item.path}
          className="relative text-[var(--neutral-light)] hover:text-[var(--brand)] transition"
        >
          {item.label}
        </Link>
      );
    }

    return (
      <button
        onClick={() => handleScrollTo(item.section)}
        className="relative text-[var(--neutral-light)] hover:text-[var(--brand)] transition bg-transparent border-none"
      >
        {item.label}
      </button>
    );
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center
                 bg-[var(--brand-light)]/70 backdrop-blur-md shadow-lg border-b border-[var(--neutral-mid)]"
      variants={{
        visible: {
          y: 0,
          opacity: 1,
        },

        hidden: {
          y: -100,
          opacity: 0,
        },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <KeplexImage
          name="mainlogo"
          alt="Keplex Logo"
          className="w-12 h-12 rounded-full object-cover shadow-md"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8 font-medium">
        {navLinks.map((item) => (
          <NavLinkButton
            key={item.label}
            item={item}
          />
        ))}
      </div>

      {/* Right Actions */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/cart"
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <ShoppingCart size={22} />
        </Link>

        <Link
          to="/admin/login"
          className="px-4 py-2 rounded-full bg-black text-white text-sm"
        >
          Admin
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-[var(--neutral-dark)] z-[60]"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-300 ${
          menuOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      />

      {/* Mobile Menu */}
      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={
          menuOpen
            ? {
                scale: 1,
                opacity: 1,
              }
            : {
                scale: 0.8,
                opacity: 0,
              }
        }
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="fixed inset-0 flex items-center justify-center md:hidden z-50"
      >
        <motion.div
          className="relative bg-[var(--brand-light)]/95 backdrop-blur-xl rounded-3xl shadow-2xl
                     p-10 w-[85%] max-w-sm flex flex-col items-center space-y-8 text-2xl font-semibold
                     text-[var(--neutral-light)] border border-white/10"
        >
          <button
            className="absolute top-6 right-6 p-2 text-[var(--neutral-light)]"
            onClick={() => setMenuOpen(false)}
          >
            <X size={32} />
          </button>

          {navLinks.map((item) => (
            <NavLinkButton
              key={item.label}
              item={item}
            />
          ))}

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>

          <Link
            to="/admin/login"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}