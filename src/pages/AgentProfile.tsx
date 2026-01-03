import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import {
  Star,
  MapPin,
  Phone,
  Calendar,
  BadgeCheck,
  Crown,
  Globe,
  Clock,
  ArrowLeft,
  Circle,
  Loader2,
} from "lucide-react";

interface Agent {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  categories: string[];
  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;
  description: string | null;
  offers: string | null;
  available: boolean;
  verified: boolean;
  premium: boolean;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  totalReviews?: number;
  completedDeals?: number;
}

interface Review {
  stars: number;
  created_at: string;
}

const AgentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
const [selectedRating, setSelectedRating] = useState(0);
const [hoveredRating, setHoveredRating] = useState(0);
const [submittingReview, setSubmittingReview] = useState(false);
  const [callingNow, setCallingNow] = useState(false);
const [showScheduleDialog, setShowScheduleDialog] = useState(false);
const [showPhoneDialog, setShowPhoneDialog] = useState(false);
const [scheduledTime, setScheduledTime] = useState("");
const [agentPhone, setAgentPhone] = useState("");
  const { toast } = useToast();
const [schedulingCall, setSchedulingCall] = useState(false);
const [callScheduled, setCallScheduled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAgentData();
    }
  }, [id]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch agent data
      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

      if (agentError) throw agentError;

      if (!agent) {
        setError("Agent not found");
        return;
      }

      // Fetch reviews for this agent
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("stars, created_at")
        .eq("agent_id", id);

      if (reviewsError) throw reviewsError;

      // Calculate rating statistics
      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0
        ? (reviewsData.reduce((sum, review) => sum + review.stars, 0) / totalReviews).toFixed(1)
        : 0;

      // Fetch completed calls count
      const { count: completedCalls } = await supabase
        .from("calls")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", id);

      setAgentData({
        ...agent,
        // @ts-ignore
        rating: parseFloat(averageRating),
        totalReviews: totalReviews,
        completedDeals: completedCalls || 0,
      });

      setReviews(reviewsData || []);
    } catch (err: any) {
      console.error("Error fetching agent data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!reviews.length) return [];

    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.stars === stars).length;
      const percentage = Math.round((count / reviews.length) * 100);
      return { stars, percentage };
    });

    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // Get member since year
  const getMemberSince = (createdAt: string) => {
    return new Date(createdAt).getFullYear().toString();
  };


// Updated handleCallNow function - Opens phone dialer

// Updated handleCallNow function - Opens phone dialer

const handleCallNow = async () => {
  try {
    setCallingNow(true);

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a call",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!agentData?.phone) {
      toast({
        title: "Phone Number Unavailable",
        description: "Agent's phone number is not available",
        variant: "destructive",
      });
      return;
    }

    // Detect if user is on mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Create a call entry
    const { data: callData, error: callError } = await supabase
      .from("calls")
      .insert({
        customer_id: user.id,
        agent_id: id,
        status: "completed",
        scheduled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (callError) throw callError;

    if (!isMobile) {
      // On desktop/laptop - Open WhatsApp Web
      const phoneNumber = agentData.phone.replace(/\D/g, ''); // Remove non-digits
      const countryCode = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;
      const message = encodeURIComponent(`Hi ${agentData.full_name}, I found your profile on the platform and would like to connect with you.`);
      
      // Open WhatsApp Web in new tab
      window.open(`https://web.whatsapp.com/send?phone=${countryCode}&text=${message}`, '_blank');
      
      toast({
        title: "Opening WhatsApp Web",
        description: "You can chat with the agent on WhatsApp",
      });

      // Show rating dialog after a delay
      setTimeout(() => {
        setShowRatingDialog(true);
      }, 5000);
    } else {
      // On mobile - Open phone dialer
      window.location.href = `tel:${agentData.phone}`;

      // Show rating dialog after a delay (assuming user might return)
      setTimeout(() => {
        setShowRatingDialog(true);
      }, 3000);
    }

  } catch (err: any) {
    console.error("Error initiating call:", err);
    toast({
      title: "Failed to Initiate Call",
      description: err.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setCallingNow(false);
  }
};
  
  const handleScheduleCall = async () => {
    if (!scheduledTime) {
      toast({
        title: "Time Required",
        description: "Please select a time for the call",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setSchedulingCall(true);
  
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to schedule a call",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
  
      // Create a new call entry with status 'scheduled'
      const { data: callData, error: callError } = await supabase
        .from("calls")
        .insert({
          customer_id: user.id,
          agent_id: id,
          status: "scheduled",
          scheduled_at: new Date(scheduledTime).toISOString(),
        })
        .select()
        .single();
  
      if (callError) throw callError;
  
      setShowScheduleDialog(false);
      
      // Show phone number
      setAgentPhone(agentData?.phone || "Not available");
      setShowPhoneDialog(true);
  
      toast({
        title: "Call Scheduled Successfully!",
        description: "The agent will contact you at the scheduled time.",
      });
  
    } catch (err: any) {
      console.error("Error scheduling call:", err);
      toast({
        title: "Failed to Schedule Call",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSchedulingCall(false);
    }
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setSubmittingReview(true);
  
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to submit a review",
          variant: "destructive",
        });
        return;
      }
  
      // Insert or update review
      const { error: reviewError } = await supabase
        .from("reviews")
        .upsert({
          customer_id: user.id,
          agent_id: id,
          stars: selectedRating,
        }, {
          onConflict: 'customer_id,agent_id'
        });
  
      if (reviewError) throw reviewError;
  
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
  
      setShowRatingDialog(false);
      setSelectedRating(0);
      setHoveredRating(0);
      
      // Refresh agent data to show updated rating
      fetchAgentData();
  
    } catch (err: any) {
      console.error("Error submitting review:", err);
      toast({
        title: "Failed to Submit Review",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading agent profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !agentData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "The agent you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/agents")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse categories array
  const categories = agentData.categories || [];
  const languages = ["Hindi", "English"]; // Default languages, can be added to DB

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        agentData.avatar_url ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${agentData.full_name}`
                      }
                      alt={agentData.full_name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover"
                    />
                    {/* Online Status */}
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                        agentData.available
                          ? "bg-green-500"
                          : "bg-muted-foreground/50"
                      }`}
                    />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">
                        {agentData.full_name}
                      </h1>
                      {agentData.verified && (
                        <div className="group relative">
                          <BadgeCheck className="h-6 w-6 text-primary" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Verified Agent - Identity & credentials verified
                          </div>
                        </div>
                      )}
                      {agentData.premium && (
                        <div className="group relative">
                          <Crown className="h-6 w-6 text-amber-500" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            Premium Agent - Priority support & benefits
                          </div>
                        </div>
                      )}
                    </div>

                    {categories.length > 0 && (
                      <p className="text-primary font-medium mb-2">
                        {categories[0]}
                      </p>
                    )}
                    {agentData.offers && (
                      <p className="text-muted-foreground mb-4">
                        {agentData.offers}
                      </p>
                    )}

                    {/* Availability Status */}
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                        agentData.available
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Circle
                        className={`h-3 w-3 ${
                          agentData.available
                            ? "fill-green-500 text-green-500"
                            : "fill-muted-foreground text-muted-foreground"
                        }`}
                      />
                      {agentData.available
                        ? "Available Now"
                        : "Currently Unavailable"}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-xl font-bold">
                        {agentData.rating && agentData.rating > 0
                          ? agentData.rating
                          : "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {agentData.totalReviews} reviews
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">5+ years</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {agentData.completedDeals}+
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Calls Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">
                      {getMemberSince(agentData.created_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {agentData.description && (
                <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {agentData.description}
                  </p>
                </div>
              )}

              {/* Expertise & Details */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">
                  Expertise & Details
                </h2>

                <div className="space-y-4">
                  {/* Domains */}
                  {categories.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Specializations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="rounded-lg"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Languages Spoken
                    </p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Response Time
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Usually responds within 1 hour</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              {agentData.totalReviews && agentData.totalReviews > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-semibold mb-6">Reviews</h2>

                  {/* Rating Overview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-1">
                        {agentData.rating}
                      </div>
                      <div className="flex items-center justify-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(agentData.rating || 0)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {agentData.totalReviews} reviews
                      </p>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1 space-y-2 w-full sm:w-auto">
                      {ratingDistribution.map(({ stars, percentage }) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground w-3">
                            {stars}
                          </span>
                          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-10">
                            {percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center pt-4 border-t border-border/50">
                    Reviews are based on verified interactions. Only star
                    ratings are shown to maintain privacy.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Contact Agent</h3>

                {/* Location */}
                {(agentData.area || agentData.city) && (
                  <div className="flex items-start gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {[agentData.area, agentData.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {agentData.state && (
                        <p className="text-sm text-muted-foreground">
                          {agentData.state}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Per Call
                    </span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <div>
                      <span className="text-sm font-medium">
                        Monthly Subscription
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Unlimited calls
                      </p>
                    </div>
                    <span className="font-semibold text-primary">
                      Free
                    </span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                <Button
  className="w-full h-12 rounded-xl"
  size="lg"
  disabled={!agentData.available || callingNow}
  onClick={handleCallNow}
>
  {callingNow ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Processing...
    </>
  ) : (
    <>
      <Phone className="h-4 w-4 mr-2" />
      {agentData.available ? "Call Now" : "Agent Unavailable"}
    </>
  )}
</Button>
{/* <Button
  variant="outline"
  className="w-full h-12 rounded-xl"
  size="lg"
  onClick={() => setShowScheduleDialog(true)}
>
  <Calendar className="h-4 w-4 mr-2" />
  Schedule Call
</Button> */}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-6 pt-6 border-t border-border/50">
                  {agentData.verified && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}
                  {agentData.premium && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-full text-xs font-medium text-amber-600">
                      <Crown className="h-3.5 w-3.5" />
                      Premium
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Schedule Call Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
            <DialogDescription>
              Choose a date and time for your call with {agentData?.full_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="datetime">Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleScheduleCall}
              disabled={schedulingCall || !scheduledTime}
            >
              {schedulingCall ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm Schedule"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Number Dialog */}
    {/* Phone Number Dialog */}
<Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        Call Entry Created
      </DialogTitle>
      <DialogDescription>
        Here's the agent's contact number
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-center p-6 bg-muted rounded-xl">
        <div className="text-center">
          <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground mb-2">
            {agentData?.full_name}'s Number
          </p>
          <p className="text-2xl font-bold tracking-wide">
            {agentPhone}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setShowPhoneDialog(false);
            setShowRatingDialog(true);
          }}
        >
          Rate Agent
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            setShowPhoneDialog(false);
            setScheduledTime("");
          }}
        >
          Done
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

{/* Rating Dialog */}
<Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Rate Your Experience</DialogTitle>
      <DialogDescription>
        How would you rate your interaction with {agentData?.full_name}?
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-6 py-4">
      {/* Star Rating */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-10 w-10 transition-colors ${
                star <= (hoveredRating || selectedRating)
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Rating Label */}
      {selectedRating > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {selectedRating === 1 && "Poor"}
          {selectedRating === 2 && "Fair"}
          {selectedRating === 3 && "Good"}
          {selectedRating === 4 && "Very Good"}
          {selectedRating === 5 && "Excellent"}
        </p>
      )}

      {/* Submit Button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setShowRatingDialog(false);
            setSelectedRating(0);
            setHoveredRating(0);
          }}
        >
          Skip
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmitReview}
          disabled={submittingReview || selectedRating === 0}
        >
          {submittingReview ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Rating"
          )}
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default AgentProfile;
