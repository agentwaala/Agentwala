import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  TrendingUp,
  Users,
  Edit,
  Save,
  Circle,
  IndianRupee,
  Settings,
  History,
} from "lucide-react";

// Mock agent data
const agentData = {
  id: 1,
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91 98765 43210",
  domain: "Real Estate",
  bio: "Luxury property specialist with 15+ years of experience",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  isOnline: true,
  isVerified: true,
  isPremium: true,
  rating: 4.9,
  totalReviews: 127,
  location: {
    city: "Bangalore",
    area: "Koramangala",
    pincode: "560034",
  },
  languages: ["Hindi", "English", "Kannada"],
  pricing: {
    perCall: 24,
  },
  earnings: {
    today: 1200,
    thisWeek: 8400,
    thisMonth: 36000,
    total: 450000,
  },
  stats: {
    totalCalls: 450,
    completedDeals: 127,
    responseRate: 98,
  },
  verificationStatus: "verified",
  subscriptionStatus: "active",
  subscriptionExpiry: "2025-12-31",
};

const callHistory = [
  { id: 1, customer: "Amit S.", date: "Dec 28, 2024", duration: "12 min", rating: 5, domain: "Property Inquiry" },
  { id: 2, customer: "Priya R.", date: "Dec 28, 2024", duration: "8 min", rating: 5, domain: "Commercial Space" },
  { id: 3, customer: "Vikram K.", date: "Dec 27, 2024", duration: "15 min", rating: 4, domain: "Rental Assistance" },
  { id: 4, customer: "Sneha M.", date: "Dec 27, 2024", duration: "20 min", rating: 5, domain: "Villa Showing" },
  { id: 5, customer: "Rahul G.", date: "Dec 26, 2024", duration: "10 min", rating: 5, domain: "Property Inquiry" },
];

const cities = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune"];

const AgentDashboard = () => {
  const [isOnline, setIsOnline] = useState(agentData.isOnline);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: agentData.name,
    bio: agentData.bio,
    city: agentData.location.city,
    area: agentData.location.area,
    pincode: agentData.location.pincode,
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"
            }`}
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
              <h1 className="text-2xl sm:text-3xl font-bold">Agent Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile and leads</p>
            </div>
            
            {/* Availability Toggle */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Circle className={`h-3 w-3 ${isOnline ? "fill-green-500 text-green-500" : "fill-muted-foreground text-muted-foreground"}`} />
                <span className="font-medium">{isOnline ? "Available Now" : "Currently Unavailable"}</span>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Earnings Summary */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Earnings Summary</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary">₹{agentData.earnings.today}</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold">₹{agentData.earnings.thisWeek.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold">₹{agentData.earnings.thisMonth.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold">₹{(agentData.earnings.total / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">All Time</p>
                  </div>
                </div>
              </div>

              {/* Call History */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Recent Leads / Calls</h2>
                </div>
                <div className="space-y-4">
                  {callHistory.map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{call.customer}</p>
                          <p className="text-sm text-muted-foreground">{call.domain}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(call.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground">{call.date} • {call.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Edit Section */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Profile Settings</h2>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
                    <Input 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">City</label>
                    <Select value={profileData.city} onValueChange={(val) => setProfileData({...profileData, city: val})} disabled={!isEditing}>
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
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Area / Locality</label>
                    <Input 
                      value={profileData.area}
                      onChange={(e) => setProfileData({...profileData, area: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Pincode</label>
                    <Input 
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">Bio / Tagline</label>
                    <Textarea 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative mb-4">
                    <img 
                      src={agentData.image} 
                      alt={agentData.name}
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                      isOnline ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{agentData.name}</h3>
                    {agentData.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                    {agentData.isPremium && <Crown className="h-5 w-5 text-amber-500" />}
                  </div>
                  <p className="text-primary text-sm font-medium">{agentData.domain}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(agentData.rating))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Total Calls</span>
                    <span className="font-semibold">{agentData.stats.totalCalls}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-semibold text-green-600">{agentData.stats.responseRate}%</span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Verification Status</h3>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-600">Verified Agent</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Your identity is verified</p>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Premium Status</h3>
                </div>
                {agentData.isPremium ? (
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-600">Premium Active</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Expires: {agentData.subscriptionExpiry}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Upgrade to get priority ranking and more visibility</p>
                    <Button className="w-full rounded-xl">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgentDashboard;