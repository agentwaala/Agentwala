import { Link } from "react-router-dom";
import { 
  Shirt, Home, Pill, Apple, Wheat, Footprints, Sparkles, Tractor, 
  Grid3X3, Car, Plane, ArrowRight 
} from "lucide-react";

const domains = [
  { name: "Clothes Agents", icon: Shirt, count: "850+ agents", color: "from-pink-500/20 to-pink-600/10", iconColor: "text-pink-600" },
  { name: "Real Estate Agents", icon: Home, count: "1,200+ agents", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-600" },
  { name: "Medicine Agents (MR)", icon: Pill, count: "620+ agents", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-600" },
  { name: "Fruit Agents", icon: Apple, count: "450+ agents", color: "from-red-500/20 to-red-600/10", iconColor: "text-red-600" },
  { name: "Crop Seeds Agents", icon: Wheat, count: "380+ agents", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-600" },
  { name: "Shoes Agents", icon: Footprints, count: "290+ agents", color: "from-violet-500/20 to-violet-600/10", iconColor: "text-violet-600" },
  { name: "Beauty Products Agents", icon: Sparkles, count: "520+ agents", color: "from-rose-500/20 to-rose-600/10", iconColor: "text-rose-600" },
  { name: "Crop Agents", icon: Tractor, count: "680+ agents", color: "from-lime-500/20 to-lime-600/10", iconColor: "text-lime-600" },
  { name: "Tiles Agents", icon: Grid3X3, count: "340+ agents", color: "from-slate-500/20 to-slate-600/10", iconColor: "text-slate-600" },
  { name: "Vehicle Brokers", icon: Car, count: "760+ agents", color: "from-orange-500/20 to-orange-600/10", iconColor: "text-orange-600" },
  { name: "Tours & Travel Agents", icon: Plane, count: "580+ agents", color: "from-cyan-500/20 to-cyan-600/10", iconColor: "text-cyan-600" },
];

export function DomainsSection() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Agent Categories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Agents by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with verified middlemen across 11+ categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {domains.map((domain) => (
            <Link
              key={domain.name}
              to={`/agents?domain=${encodeURIComponent(domain.name)}`}
              className="group bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <domain.icon className={`h-7 w-7 ${domain.iconColor}`} />
              </div>
              
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {domain.name}
              </h3>
              <p className="text-sm text-muted-foreground">{domain.count}</p>
              
              <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore</span>
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/domains" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View all categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}