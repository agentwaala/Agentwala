import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import heroBgDark from "@/assets/hero-bg-dark.jpg";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let targetX = canvas.width / 2;
    let targetY = canvas.height / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawWave = () => {
      if (!ctx || !canvas) return;

      // Smooth follow
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create multiple wave layers
      const waves = [
        { amplitude: 80, frequency: 0.008, speed: 0.02, opacity: 0.15, offset: 0 },
        { amplitude: 60, frequency: 0.01, speed: 0.025, opacity: 0.12, offset: 100 },
        { amplitude: 100, frequency: 0.006, speed: 0.015, opacity: 0.1, offset: 200 },
      ];

      waves.forEach((wave, index) => {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsla(200, 100%, 85%, ${wave.opacity})`);
        gradient.addColorStop(0.5, `hsla(210, 100%, 88%, ${wave.opacity})`);
        gradient.addColorStop(1, `hsla(195, 100%, 82%, ${wave.opacity})`);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // Calculate mouse influence
        const mouseInfluence = 50;
        const distanceFromCenter = (currentX - canvas.width / 2) / canvas.width;

        for (let x = 0; x <= canvas.width; x += 5) {
          // Distance from mouse
          const dx = x - currentX;
          const dy = canvas.height / 2 - currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const mouseEffect = Math.max(0, 1 - distance / 400) * mouseInfluence;

          // Wave calculation with mouse influence
          const baseY = canvas.height * 0.6 + wave.offset;
          const waveY = Math.sin(x * wave.frequency + time * wave.speed + index) * wave.amplitude;
          const mouseWave = Math.sin((x + currentX * 0.1) * 0.01 + time * 0.03) * mouseEffect;
          const tiltEffect = distanceFromCenter * 30 * (x / canvas.width);
          
          const y = baseY + waveY + mouseWave + tiltEffect;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw floating orbs that follow mouse
      const orbGradient = ctx.createRadialGradient(
        currentX * 0.3 + canvas.width * 0.2, 
        currentY * 0.3 + 100, 
        0,
        currentX * 0.3 + canvas.width * 0.2, 
        currentY * 0.3 + 100, 
        300
      );
      orbGradient.addColorStop(0, 'hsla(200, 100%, 90%, 0.3)');
      orbGradient.addColorStop(1, 'hsla(200, 100%, 90%, 0)');
      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orbGradient2 = ctx.createRadialGradient(
        canvas.width - currentX * 0.2, 
        currentY * 0.4 + 200, 
        0,
        canvas.width - currentX * 0.2, 
        currentY * 0.4 + 200, 
        250
      );
      orbGradient2.addColorStop(0, 'hsla(210, 100%, 88%, 0.25)');
      orbGradient2.addColorStop(1, 'hsla(210, 100%, 88%, 0)');
      ctx.fillStyle = orbGradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 1;
      animationRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Interactive wave background for light mode */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        />
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
