import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import {
  Gamepad2,
  Store,
  Info,
  LogIn,
  UserPlus,
  User,
  Menu,
  X,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Games", icon: Gamepad2, href: "#games" },
  { label: "Store", icon: Store, href: "#store" },
  { label: "About Us", icon: Info, href: "#about" },
];

export function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  // Toggle this to true to preview authenticated state
  const [loggedIn] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Pixel-border bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />

      {/* Scanline texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #00ff00 0px, #00ff00 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="relative backdrop-blur-md bg-black/80 border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group select-none">
              <div className="relative">
                <Zap className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                {/* pixel glow dot */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-none animate-pulse" />
              </div>
              <span
                className="text-green-400 group-hover:text-green-300 transition-colors tracking-widest uppercase"
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "13px" }}
              >
                Akademiya
              </span>
            </a>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2 px-4 py-2 text-green-300/70 hover:text-green-300 hover:bg-green-500/10 border border-transparent hover:border-green-500/30 transition-all duration-150 uppercase tracking-wider text-xs font-bold"
                    style={{ fontFamily: "monospace" }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right Side — Auth / Profile */}
            <div className="hidden md:flex items-center gap-2">
              {loggedIn ? (
                <button className="flex items-center gap-2 px-3 py-1.5 border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 text-green-300 transition-all duration-150">
                  <User className="h-4 w-4" />
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ fontFamily: "monospace" }}
                  >
                    Profile
                  </span>
                </button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 uppercase tracking-widest text-xs px-4 py-2 h-auto rounded-none"
                    style={{ fontFamily: "monospace" }}
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold uppercase tracking-widest text-xs px-4 py-2 h-auto rounded-none shadow-[0_0_12px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all"
                    style={{ fontFamily: "monospace" }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-green-400 hover:text-green-300 p-2 border border-green-500/30 hover:bg-green-500/10 transition-all"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-green-500/20 bg-black/95 backdrop-blur-md px-4 pb-4 pt-2 flex flex-col gap-1">
            {navLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-green-300/70 hover:text-green-300 hover:bg-green-500/10 border border-transparent hover:border-green-500/30 transition-all uppercase tracking-wider text-xs font-bold"
                style={{ fontFamily: "monospace" }}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
            <div className="flex gap-2 mt-2">
              <Button
                variant="ghost"
                className="flex-1 flex items-center justify-center gap-2 border border-green-500/30 text-green-400 hover:bg-green-500/10 uppercase tracking-widest text-xs h-10 rounded-none"
                style={{ fontFamily: "monospace" }}
              >
                <LogIn className="h-3.5 w-3.5" />
                Login
              </Button>
              <Button
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold uppercase tracking-widest text-xs h-10 rounded-none"
                style={{ fontFamily: "monospace" }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
