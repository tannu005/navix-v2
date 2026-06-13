import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Features", href: "/#features" },
                { label: "Process", href: "/#process" },
                { label: "Testimonials", href: "/#testimonials" },
                { label: "FAQ", href: "/#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:ytannu1410@gmail.com"
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  Get in touch
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Connect
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/tannu005"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-500 hover:text-gray-300 transition-colors p-2 border border-white/10 hover:border-white/25 rounded"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/tannu-yadav-06012733a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-gray-300 transition-colors p-2 border border-white/10 hover:border-white/25 rounded"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          {/* Protocol badge */}
          <div className="flex justify-center mb-4">
            <span className="text-xs tracking-[0.25em] text-gray-600 border border-white/10 px-3 py-1 rounded-full">
              SYSTEM PROTOCOL V2.0
            </span>
          </div>

          {/* Attribution */}
          <p className="text-center text-xs tracking-widest text-gray-600">
            BUILT BY TANNU YADAV · VIT-AP UNIVERSITY · 2026
          </p>
          <p className="text-center text-xs text-gray-700 mt-2">
            © {new Date().getFullYear()} Navix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
