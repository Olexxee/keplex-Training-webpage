import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-900 text-white py-8">
      <div className="px-6 md:px-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section */}
        <div className="text-sm text-center md:text-left text-neutral-300">
          © {new Date().getFullYear()} <strong>Keplex Training</strong>. All
          rights reserved.
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Links */}
          <div className="flex items-center gap-4 text-neutral-400">
            <a
              href="#"
              className="text-xs md:text-sm hover:text-green-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs md:text-sm hover:text-green-400 transition-colors"
            >
              Terms
            </a>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-neutral-600 mx-2" />

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/share/1Aw9LNYjkD/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-green-400 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://wa.me/2348101064798"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-green-400 transition-colors"
            >
              <MessageCircle size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@kcrafthub_ileife?_t=ZS-90pEipnDZ0p&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-green-400 transition-colors"
            >
              <Music2 size={20} />
            </a>
            <a
              href="https://www.instagram.com/keplexcrafthub5?igsh=dm9jcnVqcWNwMjky"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-green-400 transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
