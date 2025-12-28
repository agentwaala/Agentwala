import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background Card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent rounded-[2rem] sm:rounded-[3rem]" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Glow effects */}
          <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px]" />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
              Ready to Share Your
              <br />
              Expertise with the World?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
              Join our network of verified agents and connect with clients looking for your skills.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/become-agent">
                <Button 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-14 px-10 text-base font-semibold shadow-xl"
                >
                  Become an Agent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/agents">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-10 text-base"
                >
                  Browse Agents
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 pt-10 border-t border-primary-foreground/20">
              {[
                { label: "No upfront fees", icon: "💰" },
                { label: "Verified profiles", icon: "✓" },
                { label: "Quality leads", icon: "📈" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-primary-foreground/80">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
