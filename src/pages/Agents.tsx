import { useState } from "react";
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
import { Star, MapPin, Search, SlidersHorizontal, X, Verified, MessageCircle } from "lucide-react";

const allAgents = [
  {
    id: 1,
    name: "Rajesh Sharma",
    domain: "Real Estate",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    verified: true,
    description: "Expert in luxury properties with 10+ years of experience in Mumbai real estate market.",
    responseTime: "< 1 hour",
  },
  {
    id: 2,
    name: "Priya Patel",
    domain: "Tech Consulting",
    rating: 4.8,
    reviews: 89,
    location: "Bengaluru, Karnataka",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    description: "Cloud architecture specialist helping businesses scale their infrastructure efficiently.",
    responseTime: "< 2 hours",
  },
  {
    id: 3,
    name: "Amit Kumar",
    domain: "Tourism",
    rating: 5.0,
    reviews: 203,
    location: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    verified: true,
    description: "Certified travel guide specializing in unique cultural experiences across Rajasthan.",
    responseTime: "< 30 min",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    domain: "Business",
    rating: 4.7,
    reviews: 156,
    location: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    verified: true,
    description: "Business strategist with expertise in startup consulting and market expansion.",
    responseTime: "< 3 hours",
  },
  {
    id: 5,
    name: "Vikram Singh",
    domain: "Education",
    rating: 4.9,
    reviews: 94,
    location: "Delhi, Delhi",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    verified: true,
    description: "Career counselor helping students and professionals find their ideal career paths.",
    responseTime: "< 1 hour",
  },
  {
    id: 6,
    name: "Ananya Iyer",
    domain: "Healthcare",
    rating: 4.8,
    reviews: 112,
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    verified: true,
    description: "Wellness coach and fitness expert with a holistic approach to health.",
    responseTime: "< 2 hours",
  },
  {
    id: 7,
    name: "Arjun Mehta",
    domain: "Legal",
    rating: 4.6,
    reviews: 78,
    location: "Ahmedabad, Gujarat",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    verified: true,
    description: "Corporate lawyer specializing in business contracts and compliance matters.",
    responseTime: "< 4 hours",
  },
  {
    id: 8,
    name: "Kavita Joshi",
    domain: "Fashion",
    rating: 4.9,
    reviews: 145,
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    verified: true,
    description: "Personal stylist with connections to top fashion designers across India.",
    responseTime: "< 1 hour",
  },
];

const domains = ["All Domains", "Real Estate", "Tech Consulting", "Tourism", "Business", "Education", "Healthcare", "Legal", "Fashion"];
const locations = ["All Locations", "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Kerala"];

const Agents = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "All Domains");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All Domains" || agent.domain === selectedDomain;
    const matchesLocation = selectedLocation === "All Locations" || agent.location.includes(selectedLocation);
    return matchesSearch && matchesDomain && matchesLocation;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All Domains");
    setSelectedLocation("All Locations");
  };

  const hasActiveFilters = searchQuery || selectedDomain !== "All Domains" || selectedLocation !== "All Locations";

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
                Browse our network of {allAgents.length}+ verified professionals.
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

            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => (
                  <Link 
                    key={agent.id} 
                    to={`/agents/${agent.id}`} 
                    className="group animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl dark:hover:shadow-primary/5">
                      <div className="p-6">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <img
                              src={agent.image}
                              alt={agent.name}
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
                                {agent.name}
                              </h3>
                              <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-primary/10 rounded-lg">
                                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                <span className="text-sm font-semibold text-primary">{agent.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-primary text-sm font-medium mb-1">
                              {agent.domain}
                            </p>
                            
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{agent.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {agent.description}
                        </p>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>Replies {agent.responseTime}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{agent.reviews} reviews</span>
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
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
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
