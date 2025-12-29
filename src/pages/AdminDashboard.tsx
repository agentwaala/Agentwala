import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  BadgeCheck,
  Crown,
  Users,
  TrendingUp,
  Phone,
  IndianRupee,
  Search,
  Check,
  X,
  Filter,
  BarChart3,
  Shield,
} from "lucide-react";

// Mock stats
const dashboardStats = {
  totalUsers: 12453,
  totalAgents: 842,
  callsToday: 1256,
  revenueToday: 45600,
  pendingApprovals: 23,
};

// Top cities data
const topCities = [
  { city: "Bangalore", agents: 234, percentage: 28 },
  { city: "Mumbai", agents: 189, percentage: 22 },
  { city: "Delhi", agents: 156, percentage: 19 },
  { city: "Chennai", agents: 98, percentage: 12 },
  { city: "Hyderabad", agents: 87, percentage: 10 },
  { city: "Pune", agents: 78, percentage: 9 },
];

// Pending approvals
const pendingAgents = [
  {
    id: 1,
    name: "Vikram Singh",
    email: "vikram@example.com",
    domain: "Real Estate",
    city: "Mumbai",
    phone: "+91 98765 11111",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=400&h=400&fit=crop",
    appliedDate: "Dec 28, 2024",
    documents: ["ID Proof", "Address Proof", "Business Card"],
  },
  {
    id: 2,
    name: "Meera Patel",
    email: "meera@example.com",
    domain: "Clothes",
    city: "Ahmedabad",
    phone: "+91 98765 22222",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    appliedDate: "Dec 27, 2024",
    documents: ["ID Proof", "Address Proof"],
  },
  {
    id: 3,
    name: "Arjun Reddy",
    email: "arjun@example.com",
    domain: "Tiles",
    city: "Hyderabad",
    phone: "+91 98765 33333",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    appliedDate: "Dec 27, 2024",
    documents: ["ID Proof", "Address Proof", "Business License"],
  },
];

// All agents for search/filter
const allAgents = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    domain: "Real Estate",
    city: "Bangalore",
    isVerified: true,
    isPremium: true,
    rating: 4.9,
    totalCalls: 450,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    domain: "Clothes",
    city: "Bangalore",
    isVerified: true,
    isPremium: false,
    rating: 4.8,
    totalCalls: 234,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit@example.com",
    domain: "Tiles",
    city: "Bangalore",
    isVerified: true,
    isPremium: false,
    rating: 5.0,
    totalCalls: 567,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    status: "active",
  },
  {
    id: 4,
    name: "Sunita Reddy",
    email: "sunita@example.com",
    domain: "Beauty Products",
    city: "Bangalore",
    isVerified: true,
    isPremium: true,
    rating: 4.7,
    totalCalls: 312,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    status: "active",
  },
];

const domains = ["All Domains", "Real Estate", "Clothes", "Tiles", "Beauty Products", "Medicine", "Shoes"];
const cities = ["All Cities", "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune"];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "agents">("overview");

  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === "All Domains" || agent.domain === selectedDomain;
    const matchesCity = selectedCity === "All Cities" || agent.city === selectedCity;
    return matchesSearch && matchesDomain && matchesCity;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating) ? "fill-primary text-primary" : "fill-muted text-muted"
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
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">Manage agents, approvals, and platform analytics</p>
            </div>
            
            {/* Pending Badge */}
            {dashboardStats.pendingApprovals > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-amber-600">
                  {dashboardStats.pendingApprovals} pending approvals
                </span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "approvals", label: "Approvals", icon: BadgeCheck },
              { id: "agents", label: "All Agents", icon: Users },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="rounded-xl shrink-0"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{dashboardStats.totalAgents}</p>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/10 rounded-xl">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{dashboardStats.callsToday.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Calls Today</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <IndianRupee className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">₹{(dashboardStats.revenueToday / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Revenue Today</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{dashboardStats.pendingApprovals}</p>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                </div>
              </div>

              {/* Location Heatmap */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Top Cities by Agents</h2>
                </div>
                <div className="space-y-4">
                  {topCities.map((city) => (
                    <div key={city.city} className="flex items-center gap-4">
                      <span className="w-24 text-sm font-medium">{city.city}</span>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${city.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-20 text-right">
                        {city.agents} agents
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === "approvals" && (
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Agent Approval Queue</h2>
              </div>
              
              <div className="space-y-4">
                {pendingAgents.map((agent) => (
                  <div key={agent.id} className="p-5 bg-muted/30 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={agent.image}
                          alt={agent.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-sm text-primary">{agent.domain}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {agent.city}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Applied: {agent.appliedDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-3">
                        <div className="flex flex-wrap gap-1">
                          {agent.documents.map((doc) => (
                            <Badge key={doc} variant="secondary" className="text-xs rounded-lg">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" className="rounded-lg">
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                            <Crown className="h-4 w-4 mr-1" />
                            Premium
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Agents Tab */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              {/* Search & Filters */}
              <div className="bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search agents by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full sm:w-40 rounded-xl">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Agents List */}
              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">Agent</th>
                        <th className="text-left p-4 font-medium text-sm">Domain</th>
                        <th className="text-left p-4 font-medium text-sm">City</th>
                        <th className="text-left p-4 font-medium text-sm">Rating</th>
                        <th className="text-left p-4 font-medium text-sm">Calls</th>
                        <th className="text-left p-4 font-medium text-sm">Status</th>
                        <th className="text-left p-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent) => (
                        <tr key={agent.id} className="border-t border-border/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={agent.image}
                                alt={agent.name}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{agent.name}</span>
                                  {agent.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                                  {agent.isPremium && <Crown className="h-4 w-4 text-amber-500" />}
                                </div>
                                <span className="text-xs text-muted-foreground">{agent.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{agent.domain}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{agent.city}</span>
                          </td>
                          <td className="p-4">
                            {renderStars(agent.rating)}
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{agent.totalCalls}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="rounded-lg bg-green-500/10 text-green-600 border-0">
                              Active
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {!agent.isPremium && (
                                <Button size="sm" variant="outline" className="rounded-lg text-xs border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                                  <Crown className="h-3.5 w-3.5 mr-1" />
                                  Premium
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="rounded-lg text-xs text-destructive hover:bg-destructive/10">
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;