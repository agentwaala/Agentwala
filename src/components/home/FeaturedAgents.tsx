import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

const featuredAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    domain: "Real Estate",
    rating: 4.9,
    reviews: 127,
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    verified: true,
    specialties: ["Commercial", "Residential"],
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
    specialties: ["Cloud", "Security"],
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
    specialties: ["Adventure", "Cultural"],
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
    specialties: ["Strategy", "Finance"],
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
    specialties: ["Career", "Academic"],
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
    specialties: ["Wellness", "Fitness"],
  },
];

export function FeaturedAgents() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Featured <span className="text-primary">Agents</span>
            </h2>
            <p className="text-muted-foreground">
              Top-rated experts handpicked for excellence
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Agents Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory -mx-4 px-4"
        >
          {featuredAgents.map((agent) => (
            <Link
              key={agent.id}
              to={`/agents/${agent.id}`}
              className="snap-start shrink-0 w-[300px] group"
            >
              <div className="glass-card rounded-2xl overflow-hidden hover-lift hover:border-primary/50 dark:hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {agent.verified && (
                    <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{agent.domain}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{agent.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({agent.reviews} reviews)
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.location}</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link to="/agents">
            <Button size="lg" className="neon-glow">
              View All Agents
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
