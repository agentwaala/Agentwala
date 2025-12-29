import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBgDark from "@/assets/hero-bg-dark.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background for dark mode */}
      <div className="absolute inset-0 dark:block hidden">
        <img
          src={heroBgDark}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Background for light mode with waves */}
      <div className="absolute inset-0 dark:hidden overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        
        {/* Left wave */}
        <svg 
          className="absolute left-0 top-0 h-full w-1/3 opacity-60"
          viewBox="0 0 400 800" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path 
            d="M-100 0C-100 0 150 200 100 400C50 600 200 800 200 800L-100 800L-100 0Z" 
            fill="url(#leftWaveGradient)"
          />
          <path 
            d="M-150 0C-150 0 100 250 50 450C0 650 150 800 150 800L-150 800L-150 0Z" 
            fill="url(#leftWaveGradient2)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="leftWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210 100% 95%)" />
              <stop offset="50%" stopColor="hsl(200 100% 92%)" />
              <stop offset="100%" stopColor="hsl(217 100% 96%)" />
            </linearGradient>
            <linearGradient id="leftWaveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(199 90% 90%)" />
              <stop offset="100%" stopColor="hsl(210 100% 95%)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Right wave */}
        <svg 
          className="absolute right-0 top-0 h-full w-1/3 opacity-60"
          viewBox="0 0 400 800" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path 
            d="M500 0C500 0 250 200 300 400C350 600 200 800 200 800L500 800L500 0Z" 
            fill="url(#rightWaveGradient)"
          />
          <path 
            d="M550 0C550 0 300 250 350 450C400 650 250 800 250 800L550 800L550 0Z" 
            fill="url(#rightWaveGradient2)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="rightWaveGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(210 100% 95%)" />
              <stop offset="50%" stopColor="hsl(200 100% 92%)" />
              <stop offset="100%" stopColor="hsl(217 100% 96%)" />
            </linearGradient>
            <linearGradient id="rightWaveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(199 90% 90%)" />
              <stop offset="100%" stopColor="hsl(210 100% 95%)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Soft glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-sky-100/40 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 10,000+ Users Worldwide</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-fade-up">
            <span className="block mb-2">Find Verified Experts.</span>
            <span className="relative inline-block">
              <span className="gradient-text">Connect Instantly.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 4 150 2 298 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-center text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Discover trusted agents across Real Estate, Tourism, Tech, and more.
            Your perfect expert is just a click away.
          </p>

          {/* Search Bar Style CTA */}
          <div className="max-w-2xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500 dark:block hidden" />
              <div className="relative flex flex-col sm:flex-row gap-3 p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-background/50 rounded-xl">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="What kind of expert are you looking for?"
                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Link to="/agents">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 neon-glow text-base font-semibold">
                    Find Agents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            {[
              { value: "500+", label: "Verified Agents" },
              { value: "20+", label: "Expert Domains" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl sm:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
