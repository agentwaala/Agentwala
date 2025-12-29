import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, BadgeCheck, Crown, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedAgent {
  id: string;
  full_name: string;
  categories: string[] | null;
  avatar_url: string | null;
  city: string | null;
  area: string | null;
  state: string | null;
  available: boolean | null;
  verified: boolean | null;
  premium: boolean | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
}

export function FeaturedAgents() {
  const [agents, setAgents] = useState<FeaturedAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedAgents = async () => {
      try {
        // Fetch premium and verified agents first, limit to 4
        const { data: agentsData, error } = await supabase
          .from("agents")
          .select("*")
          .eq("profile_complete", true)
          .order("premium", { ascending: false })
          .order("verified", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;

        if (agentsData && agentsData.length > 0) {
          // Fetch reviews for these agents
          const agentIds = agentsData.map((a) => a.id);
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("agent_id, stars")
            .in("agent_id", agentIds);

          // Calculate average ratings
          const agentsWithRatings = agentsData.map((agent) => {
            const agentReviews = reviewsData?.filter((r) => r.agent_id === agent.id) || [];
            const avgRating = agentReviews.length > 0
              ? agentReviews.reduce((sum, r) => sum + r.stars, 0) / agentReviews.length
              : 0;
            return {
              ...agent,
              avgRating: Math.round(avgRating * 10) / 10,
              reviewCount: agentReviews.length,
            };
          });

          setAgents(agentsWithRatings);
        }
      } catch (error) {
        console.error("Error fetching featured agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAgents();
  }, []);

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
          {loading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : agents.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No featured agents available yet.
            </div>
          ) : (
            agents.map((agent, index) => (
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
                      src={agent.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                      alt={agent.full_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    
                    {/* Rating Badge */}
                    {agent.avgRating > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-sm font-semibold">{agent.avgRating}</span>
                      </div>
                    )}

                    {/* Availability Indicator */}
                    <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      agent.available 
                        ? "bg-green-500/90 text-white" 
                        : "bg-muted/90 text-muted-foreground backdrop-blur-sm"
                    }`}>
                      <Circle className={`h-2 w-2 ${agent.available ? "fill-white" : "fill-muted-foreground"}`} />
                      {agent.available ? "Online" : "Offline"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{agent.full_name}</h3>
                      {agent.verified && (
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      )}
                      {agent.premium && (
                        <Crown className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    
                    <p className="text-primary text-sm font-medium mb-1">
                      {agent.categories?.[0] || "General"}
                    </p>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-1">
                      {agent.description || "Professional agent"}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{agent.area || agent.city || agent.state || "India"}</span>
                      </div>
                      {agent.reviewCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {agent.reviewCount} reviews
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
