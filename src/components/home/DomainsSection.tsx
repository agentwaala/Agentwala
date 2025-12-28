import { Link } from "react-router-dom";
import { 
  Building2, 
  Plane, 
  Monitor, 
  Shirt, 
  GraduationCap, 
  Briefcase,
  Heart,
  Scale,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const domains = [
  { 
    name: "Real Estate", 
    icon: Building2, 
    description: "Property experts & brokers",
    agents: 85,
    color: "from-emerald-500/20 to-teal-500/20"
  },
  { 
    name: "Tourism", 
    icon: Plane, 
    description: "Travel & hospitality guides",
    agents: 62,
    color: "from-blue-500/20 to-cyan-500/20"
  },
  { 
    name: "PCs & Tech", 
    icon: Monitor, 
    description: "Tech consultants & support",
    agents: 124,
    color: "from-violet-500/20 to-purple-500/20"
  },
  { 
    name: "Fashion", 
    icon: Shirt, 
    description: "Style & clothing experts",
    agents: 47,
    color: "from-pink-500/20 to-rose-500/20"
  },
  { 
    name: "Education", 
    icon: GraduationCap, 
    description: "Tutors & career counselors",
    agents: 93,
    color: "from-amber-500/20 to-orange-500/20"
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    description: "Consultants & advisors",
    agents: 78,
    color: "from-slate-500/20 to-zinc-500/20"
  },
  { 
    name: "Healthcare", 
    icon: Heart, 
    description: "Health & wellness experts",
    agents: 56,
    color: "from-red-500/20 to-rose-500/20"
  },
  { 
    name: "Legal", 
    icon: Scale, 
    description: "Legal advisors & consultants",
    agents: 41,
    color: "from-indigo-500/20 to-blue-500/20"
  },
];

export function DomainsSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore <span className="text-primary">Domains</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find specialized agents across various industries, each verified and ready to help.
          </p>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {domains.map((domain, index) => (
            <Link
              key={domain.name}
              to={`/agents?domain=${domain.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="glass-card rounded-2xl p-6 h-full hover-lift hover:border-primary/50 dark:hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <domain.icon className="h-6 w-6 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-1">{domain.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{domain.description}</p>
                
                {/* Agent Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{domain.agents} agents</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/domains">
            <Button variant="outline" size="lg">
              View All Domains
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
