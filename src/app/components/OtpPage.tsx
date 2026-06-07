import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Zap, ArrowLeft, ShieldCheck, RefreshCw } from "lucide-react";

export function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "your email";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    setError("");
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter all 6 digits of your OTP.");
      return;
    }
    setLoading(true);
    // Simulate verification — replace with real API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // For demo any 6-digit code passes; real impl would validate with backend
    navigate("/");
  }

  function handleResend() {
    if (resendCooldown > 0) return;
    setOtp(Array(6).fill(""));
    setError("");
    setResendCooldown(30);
    inputRefs.current[0]?.focus();
  }

  const filled = otp.filter(Boolean).length;

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
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Corner pixel decorations */}
      <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-green-500/40" />
      <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-green-500/40" />
      <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-green-500/40" />
      <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-green-500/40" />

      <div className="w-full max-w-md relative z-10">
        <div className="border border-green-500/30 bg-black/80 backdrop-blur-md p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-green-500/50 hover:text-green-400 mb-8 transition-colors group"
            style={{ fontFamily: "monospace", fontSize: "10px" }}
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="uppercase tracking-widest">Back</span>
          </button>

          {/* Icon + title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="relative">
              <div className="w-14 h-14 border-2 border-green-500/60 flex items-center justify-center bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <ShieldCheck className="h-7 w-7 text-green-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 animate-pulse" />
            </div>
            <h1
              className="text-green-400 tracking-widest text-center leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "11px" }}
            >
              VERIFY CODE
            </h1>
            <p
              className="text-green-300/50 text-center tracking-wide leading-relaxed"
              style={{ fontFamily: "monospace", fontSize: "10px" }}
            >
              OTP sent to{" "}
              <span className="text-green-400/80">{email}</span>
            </p>
          </div>

          {/* OTP inputs */}
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={[
                    "w-11 h-14 text-center text-xl font-bold bg-black border-2 text-green-300 outline-none transition-all",
                    "focus:border-green-400 focus:shadow-[0_0_12px_rgba(34,197,94,0.4)]",
                    digit ? "border-green-500/70 shadow-[0_0_8px_rgba(34,197,94,0.2)]" : "border-green-500/25",
                    error ? "border-red-500/60" : "",
                  ].join(" ")}
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-green-500/10 relative overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                style={{ width: `${(filled / 6) * 100}%` }}
              />
            </div>

            {error && (
              <p
                className="text-red-400 text-xs tracking-wide text-center"
                style={{ fontFamily: "monospace" }}
              >
                ▲ {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || filled < 6}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-green-500/20 disabled:text-green-500/40 disabled:shadow-none text-black font-bold uppercase tracking-widest text-xs h-11 rounded-none shadow-[0_0_16px_rgba(34,197,94,0.35)] hover:shadow-[0_0_24px_rgba(34,197,94,0.55)] transition-all"
              style={{ fontFamily: "monospace" }}
            >
              {loading ? (
                <span className="animate-pulse tracking-widest">Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Confirm & Enter
                </>
              )}
            </Button>
          </form>

          {/* Resend */}
          <div className="flex justify-center mt-5">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="flex items-center gap-2 text-green-500/40 hover:text-green-400 disabled:cursor-not-allowed disabled:hover:text-green-500/40 transition-colors"
              style={{ fontFamily: "monospace", fontSize: "10px" }}
            >
              <RefreshCw className="h-3 w-3" />
              {resendCooldown > 0 ? (
                <span className="uppercase tracking-widest">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <span className="uppercase tracking-widest text-green-400/70">
                  Resend OTP
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
