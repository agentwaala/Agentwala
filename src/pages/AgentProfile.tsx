import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  MapPin,
  Phone,
  Calendar,
  BadgeCheck,
  Crown,
  Globe,
  Clock,
  MessageCircle,
  ArrowLeft,
  Circle,
} from "lucide-react";

// Mock agent data - in real app this would come from API
const agentData = {
  id: 1,
  name: "Rajesh Kumar",
  domain: "Real Estate",
  tagline: "Luxury property specialist with 15+ years of experience",
  bio: "I help clients find their dream homes across Bangalore. Specializing in luxury apartments, villas, and commercial properties. With deep knowledge of local markets and a network of developers, I ensure you get the best deals.",
  rating: 4.9,
  totalReviews: 127,
  location: {
    city: "Bangalore",
    area: "Koramangala",
    distance: "2.4 km away",
  },
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  isOnline: true,
  isVerified: true,
  isPremium: true,
  experience: "15+ years",
  languages: ["Hindi", "English", "Kannada"],
  pricing: {
    perCall: 24,
    subscription: 399,
  },
  domains: ["Real Estate", "Commercial Property", "Rentals"],
  responseTime: "Usually responds within 1 hour",
  memberSince: "2020",
  completedDeals: 450,
};

// Star ratings distribution for visual display
const ratingDistribution = [
  { stars: 5, percentage: 78 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 1 },
  { stars: 1, percentage: 1 },
];

const AgentProfile = () => {
  const { id } = useParams();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/agents" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
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
                      src={agentData.image}
                      alt={agentData.name}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover"
                    />
                    {/* Online Status */}
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                      agentData.isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">{agentData.name}</h1>
                      {agentData.isVerified && (
                        <div className="group relative">
                          <BadgeCheck className="h-6 w-6 text-primary" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Verified Agent - Identity & credentials verified
                          </div>
                        </div>
                      )}
                      {agentData.isPremium && (
                        <div className="group relative">
                          <Crown className="h-6 w-6 text-amber-500" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Premium Agent - Priority support & benefits
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-primary font-medium mb-2">{agentData.domain}</p>
                    <p className="text-muted-foreground mb-4">{agentData.tagline}</p>

                    {/* Availability Status */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                      agentData.isOnline 
                        ? "bg-green-500/10 text-green-600" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Circle className={`h-3 w-3 ${agentData.isOnline ? "fill-green-500 text-green-500" : "fill-muted-foreground text-muted-foreground"}`} />
                      {agentData.isOnline ? "Available Now" : "Currently Unavailable"}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-xl font-bold">{agentData.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{agentData.totalReviews} reviews</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{agentData.experience}</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{agentData.completedDeals}+</p>
                    <p className="text-xs text-muted-foreground">Deals Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{agentData.memberSince}</p>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">{agentData.bio}</p>
              </div>

              {/* Expertise & Details */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Expertise & Details</h2>
                
                <div className="space-y-4">
                  {/* Domains */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {agentData.domains.map((domain) => (
                        <Badge key={domain} variant="secondary" className="rounded-lg">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Languages Spoken</p>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{agentData.languages.join(", ")}</span>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Response Time</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{agentData.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-6">Reviews</h2>
                
                {/* Rating Overview */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-1">{agentData.rating}</div>
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.round(agentData.rating)
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{agentData.totalReviews} reviews</p>
                  </div>

                  {/* Rating Bars */}
                  <div className="flex-1 space-y-2 w-full sm:w-auto">
                    {ratingDistribution.map(({ stars, percentage }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-3">{stars}</span>
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground text-center pt-4 border-t border-border/50">
                  Reviews are based on verified interactions. Only star ratings are shown to maintain privacy.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6 sticky top-24">
                <h3 className="font-semibold mb-4">Contact Agent</h3>

                {/* Location */}
                <div className="flex items-start gap-3 mb-4 p-3 bg-muted/50 rounded-xl">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{agentData.location.area}, {agentData.location.city}</p>
                    <p className="text-sm text-primary">{agentData.location.distance}</p>
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Per Call</span>
                    <span className="font-semibold">₹{agentData.pricing.perCall}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/20">
                    <div>
                      <span className="text-sm font-medium">Monthly Subscription</span>
                      <p className="text-xs text-muted-foreground">Unlimited calls</p>
                    </div>
                    <span className="font-semibold text-primary">₹{agentData.pricing.subscription}/mo</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full h-12 rounded-xl" 
                    size="lg"
                    disabled={!agentData.isOnline}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {agentData.isOnline ? "Call Now" : "Agent Unavailable"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl" 
                    size="lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-2 mt-6 pt-6 border-t border-border/50">
                  {agentData.isVerified && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-xs font-medium text-primary">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}
                  {agentData.isPremium && (
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
    </div>
  );
};

export default AgentProfile;