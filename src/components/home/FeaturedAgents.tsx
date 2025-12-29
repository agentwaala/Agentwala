import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, BadgeCheck, Crown, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredAgents = [
  {
    id: 1,
    name: "Rajesh Kumar",
    domain: "Real Estate",
    rating: 4.9,
    reviews: 127,
    location: "Koramangala, Bangalore",
    distance: "2.4 km",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    tagline: "Luxury property specialist",
    isOnline: true,
    isVerified: true,
    isPremium: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    domain: "Clothes",
    rating: 4.8,
    reviews: 89,
    location: "HSR Layout, Bangalore",
    distance: "3.1 km",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    tagline: "Wholesale textile expert",
    isOnline: true,
    isVerified: true,
    isPremium: false,
  },
  {
    id: 3,
    name: "Amit Patel",
    domain: "Tiles",
    rating: 5.0,
    reviews: 203,
    location: "BTM Layout, Bangalore",
    distance: "4.5 km",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    tagline: "Premium tiles & flooring",
    isOnline: false,
    isVerified: true,
    isPremium: false,
  },
  {
    id: 4,
    name: "Sunita Reddy",
    domain: "Beauty Products",
    rating: 4.7,
    reviews: 156,
    location: "Indiranagar, Bangalore",
    distance: "5.2 km",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    tagline: "Cosmetics wholesale connect",
    isOnline: true,
    isVerified: true,
    isPremium: true,
  },
];

export function FeaturedAgents() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] dark:bg-accent/10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase mb-3 block">
              Top Rated
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Featured Agents
            </h2>
          </div>
          <Link to="/agents">
            <Button variant="outline" className="group rounded-xl">
              View all agents
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAgents.map((agent, index) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl dark:hover:shadow-primary/5">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-sm font-semibold">{agent.rating}</span>
                  </div>

                  {/* Availability Indicator */}
                  <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    agent.isOnline 
                      ? "bg-green-500/90 text-white" 
                      : "bg-muted/90 text-muted-foreground backdrop-blur-sm"
                  }`}>
                    <Circle className={`h-2 w-2 ${agent.isOnline ? "fill-white" : "fill-muted-foreground"}`} />
                    {agent.isOnline ? "Online" : "Offline"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{agent.name}</h3>
                    {agent.isVerified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                    {agent.isPremium && (
                      <Crown className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                  
                  <p className="text-primary text-sm font-medium mb-1">{agent.domain}</p>
                  <p className="text-muted-foreground text-sm mb-3">{agent.tagline}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{agent.location.split(",")[0]}</span>
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                      {agent.distance}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
