import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
  BadgeCheck,
  Crown,
  Clock,
  User,
  Heart,
  History,
  Settings,
  Navigation,
} from "lucide-react";

// Mock customer data
const customerData = {
  name: "Amit Sharma",
  email: "amit@example.com",
  phone: "+91 98765 12345",
  image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  isPremium: false,
  memberSince: "2024",
  location: {
    city: "Bangalore",
    area: "HSR Layout",
  },
  subscription: {
    type: "Pay per call",
    perCallCost: 24,
  },
  stats: {
    totalCalls: 23,
    savedAgents: 8,
  },
};

const callHistory = [
  { 
    id: 1, 
    agent: "Rajesh Kumar", 
    agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    domain: "Real Estate",
    date: "Dec 28, 2024", 
    time: "2:30 PM",
    duration: "12 min", 
    rated: true,
    rating: 5,
  },
  { 
    id: 2, 
    agent: "Priya Sharma", 
    agentImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    domain: "Clothes",
    date: "Dec 27, 2024", 
    time: "11:00 AM",
    duration: "8 min", 
    rated: false,
    rating: 0,
  },
  { 
    id: 3, 
    agent: "Amit Patel", 
    agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    domain: "Tiles",
    date: "Dec 25, 2024", 
    time: "4:15 PM",
    duration: "15 min", 
    rated: true,
    rating: 4,
  },
  { 
    id: 4, 
    agent: "Sunita Reddy", 
    agentImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    domain: "Beauty Products",
    date: "Dec 22, 2024", 
    time: "10:30 AM",
    duration: "20 min", 
    rated: true,
    rating: 5,
  },
];

const savedAgents = [
  {
    id: 1,
    name: "Rajesh Kumar",
    domain: "Real Estate",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.9,
    isOnline: true,
    isVerified: true,
    isPremium: true,
    location: "Koramangala, Bangalore",
  },
  {
    id: 2,
    name: "Priya Sharma",
    domain: "Clothes",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 4.8,
    isOnline: true,
    isVerified: true,
    isPremium: false,
    location: "HSR Layout, Bangalore",
  },
  {
    id: 3,
    name: "Sunita Reddy",
    domain: "Beauty Products",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5.0,
    isOnline: false,
    isVerified: true,
    isPremium: true,
    location: "Indiranagar, Bangalore",
  },
];

const cities = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune"];

const CustomerDashboard = () => {
  const [selectedCity, setSelectedCity] = useState(customerData.location.city);
  const [ratingCall, setRatingCall] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const renderStars = (rating: number, interactive = false, callId?: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              star <= (interactive && callId === ratingCall ? hoverRating : rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted hover:fill-primary/50 hover:text-primary/50"
            }`}
            onMouseEnter={() => interactive && callId === ratingCall && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

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
                <div className="space-y-4">
                  {callHistory.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img 
                          src={call.agentImage}
                          alt={call.agent}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium">{call.agent}</p>
                          <p className="text-sm text-primary">{call.domain}</p>
                          <p className="text-xs text-muted-foreground">{call.date} • {call.time} • {call.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {call.rated ? (
                          <div className="flex flex-col items-end gap-1">
                            {renderStars(call.rating)}
                            <span className="text-xs text-muted-foreground">Rated</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            {ratingCall === call.id ? (
                              renderStars(0, true, call.id)
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="rounded-lg"
                                onClick={() => setRatingCall(call.id)}
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
              </div>

              {/* Saved Agents */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Saved Agents</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedAgents.map((agent) => (
                    <Link key={agent.id} to={`/agents/${agent.id}`}>
                      <div className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <img 
                              src={agent.image}
                              alt={agent.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card ${
                              agent.isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="font-medium truncate">{agent.name}</p>
                              {agent.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                              {agent.isPremium && <Crown className="h-4 w-4 text-amber-500 shrink-0" />}
                            </div>
                            <p className="text-sm text-primary">{agent.domain}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                <span className="text-xs font-medium">{agent.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className={`text-xs ${agent.isOnline ? "text-green-600" : "text-muted-foreground"}`}>
                                {agent.isOnline ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <img 
                    src={customerData.image} 
                    alt={customerData.name}
                    className="w-20 h-20 rounded-2xl object-cover mb-4"
                  />
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{customerData.name}</h3>
                    {customerData.isPremium && <Crown className="h-5 w-5 text-amber-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{customerData.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since {customerData.memberSince}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Total Calls</span>
                    <span className="font-semibold">{customerData.stats.totalCalls}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Saved Agents</span>
                    <span className="font-semibold">{customerData.stats.savedAgents}</span>
                  </div>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Subscription</h3>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl mb-4">
                  <p className="font-medium">{customerData.subscription.type}</p>
                  <p className="text-sm text-muted-foreground">₹{customerData.subscription.perCallCost} per call</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 mb-4">
                  <p className="text-sm font-medium mb-1">Upgrade to Monthly</p>
                  <p className="text-2xl font-bold text-primary">₹399<span className="text-sm font-normal">/month</span></p>
                  <p className="text-xs text-muted-foreground">Unlimited calls to all agents</p>
                </div>
                <Button className="w-full rounded-xl">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>

              {/* Location Preferences */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Location Preferences</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Preferred City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl">
                    <Navigation className="h-4 w-4 mr-2" />
                    Use Current Location
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