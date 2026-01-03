// pages/Domains.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Building2, Loader2, Shirt, Pill, Apple, Sprout, 
  Sparkles, Home, Car, Plane, Monitor, Sofa, Gem, 
  Plug, Hammer, Flower
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    name: "flower agent",
    icon: Flower,
    description: "Flower dealers, floriculture experts, and decoration suppliers",
    color: "from-rose-500 to-pink-600"
  }
];

interface DomainWithCount extends CategoryConfig {
  agents: number;
}

const Domains = () => {
  const [domains, setDomains] = useState<DomainWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAgents, setTotalAgents] = useState(0);

  useEffect(() => {
    fetchDomainStats();
  }, []);

  const fetchDomainStats = async () => {
    try {
      setLoading(true);

      // Fetch all agents with complete profiles
      const { data: agents, error } = await supabase
        .from('agents')
        .select('categories')
        .eq('profile_complete', true);

      if (error) {
        console.error('Error fetching agents:', error);
        setDomains(CATEGORY_CONFIGS.map(config => ({ ...config, agents: 0 })));
        return;
      }

      // Count agents per category
      const categoryCounts: Record<string, number> = {};
      const uniqueAgents = new Set<string>();

      agents?.forEach(agent => {
        if (agent.categories && Array.isArray(agent.categories)) {
          agent.categories.forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          // Count unique agents
          uniqueAgents.add(JSON.stringify(agent));
        }
      });

      console.log('Category counts:', categoryCounts);
      console.log('Total unique agents:', uniqueAgents.size);

      // Merge with category configs
      const domainsWithCounts = CATEGORY_CONFIGS.map(config => ({
        ...config,
        agents: categoryCounts[config.name] || 0
      })).sort((a, b) => b.agents - a.agents); // Sort by agent count

      setDomains(domainsWithCounts);
      setTotalAgents(uniqueAgents.size);
    } catch (err) {
      console.error('Error in fetchDomainStats:', err);
      setDomains(CATEGORY_CONFIGS.map(config => ({ ...config, agents: 0 })));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Explore All Domains
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find specialized agents across {CATEGORY_CONFIGS.length}+ categories. Each domain features verified experts ready to help.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-slate-600" />
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="text-center mb-12">
              <p className="text-lg text-slate-600">
                <span className="font-semibold text-slate-900">{totalAgents}</span> verified agents across all domains
              </p>
            </div>

            {/* Domains Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {domains.map((domain, index) => (
                <Link
                  key={index}
                  to={`/agents?domain=${encodeURIComponent(domain.name)}`}
                  className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-200"
                >
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <domain.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {domain.description}
                  </p>

                  {/* Agent Count */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-700">
                      {domain.agents} {domain.agents === 1 ? 'agent' : 'agents'}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">
                      Browse →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Domains;