import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import KeplexImage from "../utils/KeplexImage";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide/show navbar on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    setHidden(latest > previous && latest > 50);
  });

  // Lock scrolling when menu is open
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

  // Variants
  const menuVariants = {
    open: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
    closed: {},
  };

  const linkVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    closed: {
      opacity: 0,
      y: 30,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  // Shared nav link component
  const NavLink = ({ href, label, color }) => (
    <motion.a
      href={href}
      whileHover={{
        scale: 1.1,
        textShadow: `0px 0px 8px ${color}`,
        color: color,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative text-[var(--neutral-dark)] cursor-pointer"
    >
      {label}
      {/* Underline animation */}
      <motion.span
        className="absolute left-0 -bottom-1 h-[2px] w-0 bg-current"
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
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
          name="logo"
          alt="Keplex Logo"
          className="w-12 h-12 rounded-full object-cover border-2 border-[var(--brand)] shadow-md"
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

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-[var(--neutral-dark)] z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Dimmed background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 bg-black/40 z-40 pointer-events-auto"
      />

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={menuOpen ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed inset-0 overflow-hidden bg-[var(--brand-light)]/95 backdrop-blur-xl
                   flex flex-col items-center justify-center md:hidden z-50"
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 p-2 text-[var(--neutral-dark)]"
          onClick={() => setMenuOpen(false)}
        >
          <X size={36} />
        </button>

        {/* Animated Links */}
        <motion.div
          className="flex flex-col items-center space-y-8 text-2xl font-semibold text-[var(--neutral-dark)]"
          variants={menuVariants}
          initial="closed"
          animate={menuOpen ? "open" : "closed"}
        >
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
