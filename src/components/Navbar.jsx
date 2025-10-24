import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import KeplexImage from "../utils/KeplexImage";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Improved hide/show logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;
    const goingDown = diff > 5;
    const goingUp = diff < -10;

    if (goingDown && latest > 100) setHidden(true);
    else if (goingUp) setHidden(false);

    lastScrollY.current = latest;
  });

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    document.documentElement.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Smooth scroll handler for in-page sections
  const handleScrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => setMenuOpen(false), 200);
    } else {
      // fallback for full page links like /register
      window.location.href = id;
    }
  };

  // Animation Variants
  const menuVariants = {
    open: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    closed: {},
  };

  const linkVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    closed: {
      opacity: 0,
      y: 25,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const NavLink = ({ href, label, color }) => (
    <motion.button
      onClick={() => handleScrollTo(href)}
      whileHover={{
        scale: 1.05,
        textShadow: `0px 0px 8px ${color}`,
        color,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="relative text-[var(--neutral-light)] cursor-pointer bg-transparent border-none"
    >
      {label}
      <motion.span
        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-current"
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center
                 bg-[var(--brand-light)]/70 backdrop-blur-md shadow-lg border-b border-[var(--neutral-mid)]"
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Logo */}
      <a href="#hero" className="flex items-center">
        <KeplexImage
          name="mainlogo"
          alt="Keplex Logo"
          className="w-12 h-12 rounded-full object-cover shadow-md"
        />
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-8 font-medium">
        <NavLink href="#features" label="Features" color="var(--brand)" />
        <NavLink href="#about" label="About" color="var(--aqua)" />
        <NavLink
          href="#registration"
          label="Register"
          color="var(--lavender)"
        />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 text-[var(--neutral-dark)] z-[60]"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Dark Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-300 ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      {/* Centered Mobile Menu */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          menuOpen ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 flex items-center justify-center md:hidden z-50"
      >
        <motion.div
          className="relative bg-[var(--brand-light)]/95 backdrop-blur-xl rounded-3xl shadow-2xl 
                     p-10 w-[85%] max-w-sm flex flex-col items-center space-y-8 text-2xl font-semibold 
                     text-[var(--neutral-light)] border border-white/10"
          variants={menuVariants}
          initial="closed"
          animate={menuOpen ? "open" : "closed"}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 p-2 text-[var(--neutral-light)]"
            onClick={() => setMenuOpen(false)}
          >
            <X size={32} />
          </button>

          {/* Animated Links */}
          <motion.div variants={linkVariants}>
            <NavLink href="#features" label="Features" color="var(--brand)" />
          </motion.div>
          <motion.div variants={linkVariants}>
            <NavLink href="#about" label="About" color="var(--aqua)" />
          </motion.div>
          <motion.div variants={linkVariants}>
            <NavLink
              href="#registration"
              label="Register"
              color="var(--lavender)"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
