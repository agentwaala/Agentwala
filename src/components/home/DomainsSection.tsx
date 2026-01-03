import { Link } from "react-router-dom";
import { 
  Building2, Shirt, Pill, Apple, Sprout, Sparkles, Home, 
  Car, Plane, Monitor, Sofa, Gem, Plug, Hammer, Flower, ArrowRight 
} from "lucide-react";

interface CategoryConfig {
  name: string;
  icon: any;
  description: string;
  color: string;
}

const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    name: "Real Estate",
    icon: Building2,
    description: "Property experts, brokers, and real estate consultants",
    color: "from-emerald-500 to-teal-600"
  },
  {
    name: "Textiles & Clothing",
    icon: Shirt,
    description: "Textile dealers, garment suppliers, and clothing merchants",
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Medicine (MR)",
    icon: Pill,
    description: "Medical representatives and pharmaceutical agents",
    color: "from-red-500 to-rose-600"
  },
  {
    name: "Fruits & Vegetables",
    icon: Apple,
    description: "Fresh produce suppliers and agricultural traders",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Crop Seeds & Agriculture",
    icon: Sprout,
    description: "Agricultural experts, seed suppliers, and farming consultants",
    color: "from-lime-500 to-green-600"
  },
  {
    name: "Footwear",
    icon: Shirt,
    description: "Footwear dealers, shoe retailers, and wholesalers",
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Beauty Products",
    icon: Sparkles,
    description: "Cosmetics agents, beauty product distributors",
    color: "from-fuchsia-500 to-pink-600"
  },
  {
    name: "Tiles & Flooring",
    icon: Home,
    description: "Tile dealers, flooring experts, and interior material suppliers",
    color: "from-slate-500 to-zinc-600"
  },
  {
    name: "Second-hand Vehicles",
    icon: Car,
    description: "Used car dealers, pre-owned vehicle consultants",
    color: "from-gray-600 to-slate-700"
  },
  {
    name: "Tours & Travel",
    icon: Plane,
    description: "Travel agents, tour operators, and hospitality experts",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Electronics",
    icon: Monitor,
    description: "Electronics dealers, gadget suppliers, and tech consultants",
    color: "from-violet-500 to-purple-600"
  },
  {
    name: "Furniture",
    icon: Sofa,
    description: "Furniture dealers, home decor suppliers, and interior experts",
    color: "from-orange-500 to-red-600"
  },
  {
    name: "Jewellery",
    icon: Gem,
    description: "Jewellery dealers, gold and diamond merchants",
    color: "from-yellow-500 to-amber-600"
  },
  {
    name: "Home Appliances",
    icon: Plug,
    description: "Home appliance dealers and electronics retailers",
    color: "from-indigo-500 to-blue-600"
  },
  {
    name: "Building Materials",
    icon: Hammer,
    description: "Construction material suppliers and hardware dealers",
    color: "from-stone-500 to-slate-600"
  },
  {
    name: "Flower Agent",
    icon: Flower,
    description: "Flower dealers, floriculture experts, and decoration suppliers",
    color: "from-rose-500 to-pink-600"
  }
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
            Connect with verified middlemen across 16+ categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORY_CONFIGS.map((category) => (
            <Link
              key={category.name}
              to={`/agents?domain=${encodeURIComponent(category.name)}`}
              className="group bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-7 w-7 text-white" />
              </div>
              
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {category.description}
              </p>
              
              <div className="flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-medium">Explore agents</span>
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/agents" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 hover:gap-3 transition-all"
          >
            Browse All Agents
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}