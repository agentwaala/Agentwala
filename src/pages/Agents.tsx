import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Star, MapPin, Search, Filter, X, SlidersHorizontal } from "lucide-react";

const allAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    domain: "Real Estate",
    rating: 4.9,
    reviews: 127,
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    description: "Expert in luxury properties with 10+ years of experience in Manhattan real estate market.",
  },
  {
    id: 2,
    name: "Michael Chen",
    domain: "Tech Consulting",
    rating: 4.8,
    reviews: 89,
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    verified: true,
    description: "Cloud architecture specialist helping businesses scale their infrastructure efficiently.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    domain: "Tourism",
    rating: 5.0,
    reviews: 203,
    location: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    verified: true,
    description: "Certified travel guide specializing in unique cultural experiences across Europe.",
  },
  {
    id: 4,
    name: "David Park",
    domain: "Business",
    rating: 4.7,
    reviews: 156,
    location: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    verified: true,
    description: "Business strategist with expertise in Asian markets and cross-border expansion.",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    domain: "Education",
    rating: 4.9,
    reviews: 94,
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    verified: true,
    description: "Career counselor helping students and professionals find their ideal career paths.",
  },
  {
    id: 6,
    name: "James Wilson",
    domain: "Healthcare",
    rating: 4.8,
    reviews: 112,
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    verified: true,
    description: "Wellness coach and fitness expert with a holistic approach to health.",
  },
  {
    id: 7,
    name: "Anna Martinez",
    domain: "Legal",
    rating: 4.6,
    reviews: 78,
    location: "Miami, USA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    verified: true,
    description: "Immigration lawyer specializing in business visas and international relocations.",
  },
  {
    id: 8,
    name: "Robert Kim",
    domain: "Fashion",
    rating: 4.9,
    reviews: 145,
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    verified: true,
    description: "Personal stylist with connections to top fashion houses in Paris and Milan.",
  },
];

const domains = ["All", "Real Estate", "Tech Consulting", "Tourism", "Business", "Education", "Healthcare", "Legal", "Fashion"];
const locations = ["All", "USA", "Canada", "UK", "Spain", "France", "South Korea"];

const Agents = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [minRating, setMinRating] = useState([0]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All" || agent.domain === selectedDomain;
    const matchesLocation = selectedLocation === "All" || agent.location.includes(selectedLocation);
    const matchesRating = agent.rating >= minRating[0];
    return matchesSearch && matchesDomain && matchesLocation && matchesRating;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All");
    setSelectedLocation("All");
    setMinRating([0]);
  };

  const hasActiveFilters = searchQuery || selectedDomain !== "All" || selectedLocation !== "All" || minRating[0] > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 sm:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Find Your <span className="text-primary">Expert Agent</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              Browse our network of verified professionals across various domains.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search agents by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button
                variant="outline"
                className="sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="glass-card rounded-2xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>

                  {/* Domain Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Domain</label>
                    <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-4 block">
                      Minimum Rating: {minRating[0].toFixed(1)}
                    </label>
                    <Slider
                      value={minRating}
                      onValueChange={setMinRating}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Agent Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {filteredAgents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAgents.map((agent) => (
                      <Link key={agent.id} to={`/agents/${agent.id}`} className="group">
                        <div className="glass-card rounded-2xl p-5 hover-lift hover:border-primary/50 dark:hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300 h-full">
                          <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <img
                                src={agent.image}
                                alt={agent.name}
                                className="w-20 h-20 rounded-xl object-cover"
                              />
                              {agent.verified && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <Star className="h-3 w-3 text-primary-foreground fill-current" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold truncate">{agent.name}</h3>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Star className="h-4 w-4 fill-primary text-primary" />
                                  <span className="text-sm font-medium">{agent.rating}</span>
                                </div>
                              </div>
                              
                              <Badge variant="secondary" className="mb-2">
                                {agent.domain}
                              </Badge>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {agent.description}
                              </p>

                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{agent.location}</span>
                              </div>
                            </div>
                          </div>

                          <Button className="w-full mt-4 neon-glow">
                            Contact Agent
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No agents found matching your criteria.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Agents;
