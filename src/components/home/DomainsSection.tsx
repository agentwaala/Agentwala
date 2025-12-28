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
  ArrowUpRight
} from "lucide-react";

const domains = [
  { 
    name: "Real Estate", 
    icon: Building2, 
    agents: 85,
    gradient: "from-emerald-500 to-teal-600"
  },
  { 
    name: "Tourism", 
    icon: Plane, 
    agents: 62,
    gradient: "from-blue-500 to-cyan-600"
  },
  { 
    name: "PCs & Tech", 
    icon: Monitor, 
    agents: 124,
    gradient: "from-violet-500 to-purple-600"
  },
  { 
    name: "Fashion", 
    icon: Shirt, 
    agents: 47,
    gradient: "from-pink-500 to-rose-600"
  },
  { 
    name: "Education", 
    icon: GraduationCap, 
    agents: 93,
    gradient: "from-amber-500 to-orange-600"
  },
  { 
    name: "Business", 
    icon: Briefcase, 
    agents: 78,
    gradient: "from-slate-400 to-zinc-500"
  },
  { 
    name: "Healthcare", 
    icon: Heart, 
    agents: 56,
    gradient: "from-red-500 to-rose-600"
  },
  { 
    name: "Legal", 
    icon: Scale, 
    agents: 41,
    gradient: "from-indigo-500 to-blue-600"
  },
];

export function DomainsSection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-3 block">
            Browse Categories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Find Experts Across
            <br />
            <span className="text-muted-foreground">Every Domain</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Verified professionals ready to help you succeed.
          </p>
        </div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {domains.map((domain, index) => (
            <Link
              key={domain.name}
              to={`/agents?domain=${domain.name.toLowerCase().replace(/\s+/g, '-')}`}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                index === 0 || index === 7 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }} />
              </div>

              {/* Content */}
              <div className={`relative p-6 sm:p-8 h-full flex flex-col justify-between ${
                index === 0 || index === 7 ? 'min-h-[280px] md:min-h-[340px]' : 'min-h-[160px] sm:min-h-[180px]'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <domain.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/60 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                
                <div>
                  <h3 className="font-bold text-white text-xl sm:text-2xl mb-1">{domain.name}</h3>
                  <p className="text-white/70 text-sm">{domain.agents} verified agents</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
