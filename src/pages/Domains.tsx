import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Building2, 
  Plane, 
  Monitor, 
  Shirt, 
  GraduationCap, 
  Briefcase,
  Heart,
  Scale,
  Car,
  Camera,
  Music,
  Palette,
  Dumbbell,
  Home,
  Utensils,
  Baby
} from "lucide-react";

const domains = [
  { name: "Real Estate", icon: Building2, description: "Property experts, brokers, and real estate consultants", agents: 85, color: "from-emerald-500 to-teal-600" },
  { name: "Tourism", icon: Plane, description: "Travel guides, tour operators, and hospitality experts", agents: 62, color: "from-blue-500 to-cyan-600" },
  { name: "PCs & Tech", icon: Monitor, description: "Tech consultants, IT support, and digital experts", agents: 124, color: "from-violet-500 to-purple-600" },
  { name: "Fashion", icon: Shirt, description: "Style consultants, personal shoppers, and designers", agents: 47, color: "from-pink-500 to-rose-600" },
  { name: "Education", icon: GraduationCap, description: "Tutors, career counselors, and academic advisors", agents: 93, color: "from-amber-500 to-orange-600" },
  { name: "Business", icon: Briefcase, description: "Business consultants, strategists, and advisors", agents: 78, color: "from-slate-500 to-zinc-600" },
  { name: "Healthcare", icon: Heart, description: "Health consultants, wellness coaches, and fitness experts", agents: 56, color: "from-red-500 to-rose-600" },
  { name: "Legal", icon: Scale, description: "Legal advisors, consultants, and paralegal services", agents: 41, color: "from-indigo-500 to-blue-600" },
  { name: "Automotive", icon: Car, description: "Car dealers, mechanics, and automotive consultants", agents: 38, color: "from-gray-500 to-slate-600" },
  { name: "Photography", icon: Camera, description: "Professional photographers and videographers", agents: 67, color: "from-yellow-500 to-amber-600" },
  { name: "Music", icon: Music, description: "Music teachers, producers, and sound engineers", agents: 45, color: "from-fuchsia-500 to-pink-600" },
  { name: "Art & Design", icon: Palette, description: "Artists, graphic designers, and creative consultants", agents: 72, color: "from-orange-500 to-red-600" },
  { name: "Fitness", icon: Dumbbell, description: "Personal trainers, nutritionists, and sports coaches", agents: 89, color: "from-green-500 to-emerald-600" },
  { name: "Interior Design", icon: Home, description: "Interior designers and home decorators", agents: 34, color: "from-teal-500 to-cyan-600" },
  { name: "Culinary", icon: Utensils, description: "Chefs, caterers, and culinary consultants", agents: 51, color: "from-rose-500 to-pink-600" },
  { name: "Childcare", icon: Baby, description: "Nannies, tutors, and childcare specialists", agents: 43, color: "from-sky-500 to-blue-600" },
];

const Domains = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 sm:py-20 border-b border-border/40">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Explore All <span className="text-primary">Domains</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find specialized agents across {domains.length}+ categories. Each domain features verified experts ready to help.
            </p>
          </div>
        </section>

        {/* Domains Grid */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {domains.map((domain, index) => (
                <Link
                  key={domain.name}
                  to={`/agents?domain=${encodeURIComponent(domain.name)}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="glass-card rounded-2xl p-6 h-full hover-lift hover:border-primary/50 dark:hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300">
                    {/* Icon with gradient background */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <domain.icon className="h-7 w-7 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-semibold text-lg mb-2">{domain.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {domain.description}
                    </p>
                    
                    {/* Agent Count */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <span className="text-sm font-medium text-primary">{domain.agents} agents</span>
                      <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                        Browse →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Domains;
