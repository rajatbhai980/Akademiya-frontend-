import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Zap, Mail, ArrowRight, Chrome } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validateEmail(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate sending OTP
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    navigate("/verify-otp", { state: { email } });
  }

  function handleGoogleLogin() {
    // Placeholder — wire up real Google OAuth here
    alert("Google OAuth not configured yet. Replace with your OAuth flow.");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #00ff00 0px, #00ff00 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Corner pixel decorations */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-green-500/40" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-green-500/40" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-green-500/40" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-green-500/40" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="border border-green-500/30 bg-black/80 backdrop-blur-md p-8 relative">
          {/* Top pixel border accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative">
              <div className="w-14 h-14 border-2 border-green-500/60 flex items-center justify-center bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Zap className="h-7 w-7 text-green-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 animate-pulse" />
            </div>
            <h1
              className="text-green-400 tracking-widest text-center leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "11px" }}
            >
              AKADEMIYA
            </h1>
            <p
              className="text-green-300/50 text-center tracking-widest"
              style={{ fontFamily: "monospace", fontSize: "11px" }}
            >
              ENTER THE QUEST
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-green-500/40 bg-green-500/5 hover:bg-green-500/15 hover:border-green-500/70 text-green-300 hover:text-green-200 transition-all duration-200 group mb-6"
          >
            {/* Google G icon */}
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span
              className="uppercase tracking-widest text-xs font-bold"
              style={{ fontFamily: "monospace" }}
            >
              Continue with Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-green-500/20" />
            <span
              className="text-green-500/40 text-xs tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              OR
            </span>
            <div className="flex-1 h-px bg-green-500/20" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-green-400/70 uppercase tracking-widest"
                style={{ fontFamily: "monospace", fontSize: "10px" }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500/50 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="hero@realm.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="pl-9 bg-black border-green-500/30 focus:border-green-500 text-green-300 placeholder:text-green-500/25 rounded-none h-11"
                  style={{ fontFamily: "monospace" }}
                />
              </div>
              {error && (
                <p
                  className="text-red-400 text-xs tracking-wide"
                  style={{ fontFamily: "monospace" }}
                >
                  ▲ {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-green-500/30 text-black font-bold uppercase tracking-widest text-xs h-11 rounded-none shadow-[0_0_16px_rgba(34,197,94,0.35)] hover:shadow-[0_0_24px_rgba(34,197,94,0.55)] transition-all"
              style={{ fontFamily: "monospace" }}
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Sending OTP</span>
                  <span className="animate-bounce">...</span>
                </>
              ) : (
                <>
                  Send OTP Code
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>

          <p
            className="text-center text-green-500/30 mt-6 leading-relaxed tracking-wide"
            style={{ fontFamily: "monospace", fontSize: "10px" }}
          >
            No account needed — we'll create one for you.
          </p>
        </div>
      </div>
    </div>
  );
}
