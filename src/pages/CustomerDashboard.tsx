import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  MapPin,
  Phone,
  BadgeCheck,
  Crown,
  User,
  Heart,
  History,
  Navigation,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { INDIA_STATES, STATE_DISTRICTS } from "@/data/indiaLocations";

interface CallWithAgent {
  id: string;
  duration_seconds: number | null;
  category: string | null;
  created_at: string;
  agent_id: string;
  agents: {
    full_name: string;
    avatar_url: string | null;
    categories: string[];
  } | null;
  review?: { stars: number } | null;
}

interface SavedAgentData {
  id: string;
  agent_id: string;
  agents: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    categories: string[];
    city: string | null;
    available: boolean;
    verified: boolean;
    premium: boolean;
  };
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null; avatar_url: string | null } | null>(null);
  const [calls, setCalls] = useState<CallWithAgent[]>([]);
  const [savedAgents, setSavedAgents] = useState<SavedAgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [ratingCall, setRatingCall] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profileData) setProfile(profileData);

      // Fetch calls with agent info
      const { data: callsData } = await supabase
        .from('calls')
        .select(`
          id,
          duration_seconds,
          category,
          created_at,
          agent_id,
          agents (
            full_name,
            avatar_url,
            categories
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (callsData) {
        // Fetch reviews for these calls
        const callsWithReviews = await Promise.all(
          callsData.map(async (call) => {
            const { data: review } = await supabase
              .from('reviews')
              .select('stars')
              .eq('customer_id', user.id)
              .eq('agent_id', call.agent_id)
              .maybeSingle();
            return { ...call, review };
          })
        );
        setCalls(callsWithReviews as CallWithAgent[]);
      }

      // Fetch saved agents
      const { data: savedData } = await supabase
        .from('saved_agents')
        .select(`
          id,
          agent_id,
          agents (
            id,
            full_name,
            avatar_url,
            categories,
            city,
            available,
            verified,
            premium
          )
        `)
        .eq('customer_id', user.id);
      
      if (savedData) setSavedAgents(savedData as unknown as SavedAgentData[]);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (agentId: string, stars: number) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('reviews')
      .upsert({
        customer_id: user.id,
        agent_id: agentId,
        stars,
      });
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Rating submitted',
      });
      setRatingCall(null);
      fetchData();
    }
  };

  const renderStars = (rating: number, interactive = false, agentId?: string) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              star <= (interactive && agentId === ratingCall ? (hoverRating || rating) : rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted hover:fill-primary/50 hover:text-primary/50"
            }`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && agentId && handleRating(agentId, star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your calls and saved agents</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Call History */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Call History</h2>
                </div>
                {calls.length > 0 ? (
                  <div className="space-y-4">
                    {calls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {call.agents?.full_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-medium">{call.agents?.full_name || 'Unknown Agent'}</p>
                            <p className="text-sm text-primary">{call.category || call.agents?.categories?.[0] || 'General'}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(call.created_at).toLocaleDateString()} • 
                              {call.duration_seconds ? ` ${Math.round(call.duration_seconds / 60)} min` : ' Pending'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {call.review ? (
                            <div className="flex flex-col items-end gap-1">
                              {renderStars(call.review.stars)}
                              <span className="text-xs text-muted-foreground">Rated</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1">
                              {ratingCall === call.agent_id ? (
                                renderStars(0, true, call.agent_id)
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={() => setRatingCall(call.agent_id)}
                                >
                                  <Star className="h-3.5 w-3.5 mr-1" />
                                  Rate
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No calls yet</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/agents">Find agents</Link>
                    </Button>
                  </div>
                )}
              </div>

              {/* Saved Agents */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Saved Agents</h2>
                </div>
                {savedAgents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {savedAgents.map((saved) => (
                      <Link key={saved.id} to={`/agents/${saved.agents.id}`}>
                        <div className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {saved.agents.full_name?.charAt(0) || 'A'}
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card ${
                                saved.agents.available ? "bg-green-500" : "bg-muted-foreground/50"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="font-medium truncate">{saved.agents.full_name}</p>
                                {saved.agents.verified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                                {saved.agents.premium && <Crown className="h-4 w-4 text-amber-500 shrink-0" />}
                              </div>
                              <p className="text-sm text-primary">{saved.agents.categories?.[0] || 'Agent'}</p>
                              <span className={`text-xs ${saved.agents.available ? "text-green-600" : "text-muted-foreground"}`}>
                                {saved.agents.available ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No saved agents</p>
                    <Button variant="link" asChild className="mt-2">
                      <Link to="/agents">Browse agents</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-4">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <h3 className="font-semibold text-lg">{profile?.full_name || 'Customer'}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Total Calls</span>
                    <span className="font-semibold">{calls.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Saved Agents</span>
                    <span className="font-semibold">{savedAgents.length}</span>
                  </div>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Subscription</h3>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="font-medium">Free for now</p>
                  <p className="text-sm text-muted-foreground">No payment required</p>
                </div>
              </div>

              {/* Location Preferences */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Location Preferences</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Preferred State</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {INDIA_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl" asChild>
                    <Link to="/agents">
                      <Navigation className="h-4 w-4 mr-2" />
                      Find Nearby Agents
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
