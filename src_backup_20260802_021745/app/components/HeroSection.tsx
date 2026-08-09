import { Button } from "./ui/button";
import { Sparkles, UserPlus, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        {/* Primary Background */}
        <div className="absolute inset-0 opacity-40">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1546949268-4d54c6adf6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXhlbCUyMGFydCUyMHplbGRhJTIwcmV0cm8lMjBnYW1lfGVufDF8fHx8MTc4MDgxMzU0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Pixel art gaming background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Secondary Background Overlay */}
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1753430708975-cac4a07d05c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw4Yml0JTIwcGl4ZWwlMjBnYW1lJTIwaXRlbXN8ZW58MXx8fHwxNzgwODEzNTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Pixel art items and gems"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Masking Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        
        {/* Green accent gradients */}
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-green-500/20 via-transparent to-transparent" />
      </div>

      {/* Pixel Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{
             backgroundImage: `
               linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent),
               linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent)
             `,
             backgroundSize: '50px 50px'
           }}
      />

      {/* Floating Pixel Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div 
              className="w-4 h-4 bg-green-500/30"
              style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Pixel Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border-2 border-green-500/50 bg-green-500/10 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-mono">Level Up Your Knowledge</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            AKADEMIYA
          </span>
          <br />
          <span className="text-green-500 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)] font-mono">
            QUEST
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Embark on an epic journey of learning. Battle through{" "}
          <span className="text-green-400 font-semibold">MCQ challenges</span>, collect knowledge gems, 
          and become the ultimate quiz champion.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-black font-bold text-lg px-8 py-6 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all border-2 border-green-400"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Quest
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 font-bold text-lg px-8 py-6 rounded-lg backdrop-blur-sm transition-all"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Sign Up
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Active Questers", value: "10,000+", icon: "👥" },
            { label: "Quiz Battles", value: "50,000+", icon: "⚔️" },
            { label: "Knowledge Gems", value: "1M+", icon: "💎" }
          ].map((stat, i) => (
            <div 
              key={i}
              className="p-6 rounded-lg bg-black/50 border-2 border-green-500/30 backdrop-blur-sm hover:border-green-500/60 transition-all hover:scale-105"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-400 font-mono mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}
