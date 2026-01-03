import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, MapPin, Search, X, Verified, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";

type Agent = Tables<"agents"> & {
  avgRating?: number;
  reviewCount?: number;
};

const domains = [
  "All Domains",
  "Clothes",
  "Real Estate",
  "flower",
  "Electronics",
  "Medicine",
  "Fruit",
  "Crop Seeds",
  "Shoes",
  "Beauty Products",
  "Tiles",
  "Tobacco Agent",
  "Second-hand Vehicles",
  "Tours & Travel",
  "Food & Vegetable",
];

const locations = [
  "All Locations",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const Agents = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "All Domains");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      
      // Fetch agents with profile_complete = true AND verified = true
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*")
        .eq("profile_complete", true)
        .eq("verified", true)
        .order("premium", { ascending: false })
        .order("created_at", { ascending: false });

      if (agentsError) throw agentsError;

      if (agentsData && agentsData.length > 0) {
        // Fetch reviews for all agents to calculate ratings
        const agentIds = agentsData.map(a => a.id);
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("agent_id, stars")
          .in("agent_id", agentIds);

        // Calculate average ratings
        const ratingsMap = new Map<string, { total: number; count: number }>();
        reviewsData?.forEach(review => {
          const existing = ratingsMap.get(review.agent_id) || { total: 0, count: 0 };
          ratingsMap.set(review.agent_id, {
            total: existing.total + review.stars,
            count: existing.count + 1,
          });
        });

        const agentsWithRatings = agentsData.map(agent => ({
          ...agent,
          avgRating: ratingsMap.has(agent.id)
            ? Math.round((ratingsMap.get(agent.id)!.total / ratingsMap.get(agent.id)!.count) * 10) / 10
            : 0,
          reviewCount: ratingsMap.get(agent.id)?.count || 0,
        }));

        setAgents(agentsWithRatings);
      } else {
        setAgents([]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      agent.full_name.toLowerCase().includes(searchLower) ||
      (agent.description?.toLowerCase().includes(searchLower) ?? false) ||
      (agent.categories?.some(cat => cat.toLowerCase().includes(searchLower)) ?? false);
    
    const matchesDomain =
      selectedDomain === "All Domains" ||
      (agent.categories?.includes(selectedDomain) ?? false);
    
    const matchesLocation =
      selectedLocation === "All Locations" ||
      agent.state === selectedLocation;
    
    return matchesSearch && matchesDomain && matchesLocation;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All Domains");
    setSelectedLocation("All Locations");
  };

  const hasActiveFilters = searchQuery || selectedDomain !== "All Domains" || selectedLocation !== "All Locations";

  const getAgentLocation = (agent: Agent) => {
    const parts = [agent.city, agent.state].filter(Boolean);
    return parts.join(", ") || "India";
  };

  const getAgentDomain = (agent: Agent) => {
    return agent.categories?.[0] || "General";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-12 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-3 block">
                Expert Network
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                Find Your Perfect
                <br />
                <span className="text-muted-foreground">Expert Agent</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Browse our network of verified professionals across India.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl bg-card border-border/50"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="h-14 min-w-[160px] rounded-xl bg-card border-border/50">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-14 min-w-[160px] rounded-xl bg-card border-border/50">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={clearFilters}
                    className="h-14 w-14 rounded-xl shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="text-foreground font-medium">{filteredAgents.length}</span> agents
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-16 h-16 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => (
                  <Link 
                    key={agent.id} 
                    to={`/agents/${agent.id}`} 
                    className="group animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl dark:hover:shadow-primary/5">
                      {agent.premium && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-primary/10 rounded-full">
                          <span className="text-xs font-semibold text-primary">Premium</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <img
                              src={agent.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.full_name)}&background=random&size=128`}
                              alt={agent.full_name}
                              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
                            />
                            {agent.verified && (
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-card">
                                <Verified className="h-3.5 w-3.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                {agent.full_name}
                              </h3>
                              {agent.avgRating > 0 && (
                                <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-primary/10 rounded-lg">
                                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                  <span className="text-sm font-semibold text-primary">{agent.avgRating}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-primary text-sm font-medium mb-1">
                              {getAgentDomain(agent)}
                            </p>
                            
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{getAgentLocation(agent)}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {agent.description || "Expert agent ready to assist you."}
                        </p>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>{agent.available ? "Available" : "Busy"}</span>
                          </div>
                          {agent.reviewCount > 0 && (
                            <span className="text-xs text-muted-foreground">{agent.reviewCount} reviews</span>
                          )}
                        </div>
                      </div>

                      {/* Hover CTA */}
                      <div className="px-6 pb-6 pt-0">
                        <Button className="w-full neon-glow opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Contact Agent
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No agents found</h3>
                <p className="text-muted-foreground mb-6">
                  {agents.length === 0 
                    ? "No verified agents available yet. Check back soon!" 
                    : "Try adjusting your search or filters"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Agents;