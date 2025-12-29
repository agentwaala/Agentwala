import { useState, useEffect } from "react";
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
  Search,
  Check,
  X,
  Filter,
  BarChart3,
  Shield,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AGENT_CATEGORIES } from "@/data/indiaLocations";

interface AgentData {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  categories: string[];
  state: string | null;
  city: string | null;
  description: string | null;
  available: boolean;
  verified: boolean;
  premium: boolean;
  profile_complete: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [pendingAgents, setPendingAgents] = useState<AgentData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    activeAgents: 0,
    totalCustomers: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState<"overview" | "approvals" | "agents">("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all agents
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (agentsError) throw agentsError;
      
      if (agentsData) {
        setAgents(agentsData);
        setPendingAgents(agentsData.filter(a => !a.verified && a.profile_complete));
        
        setStats({
          totalUsers: 0, // Would need to count from auth.users or profiles
          totalAgents: agentsData.length,
          activeAgents: agentsData.filter(a => a.available).length,
          totalCustomers: 0,
        });
      }

      // Get counts
      const { count: profileCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: customerCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');

      setStats(prev => ({
        ...prev,
        totalUsers: profileCount || 0,
        totalCustomers: customerCount || 0,
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAgent = async (agentId: string, verified: boolean) => {
    const { error } = await supabase
      .from('agents')
      .update({ verified })
      .eq('id', agentId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update agent',
        variant: 'destructive',
      });
    } else {
      toast({
        title: verified ? 'Agent verified' : 'Agent unverified',
      });
      fetchData();
    }
  };

  const handleSetPremium = async (agentId: string, premium: boolean) => {
    const { error } = await supabase
      .from('agents')
      .update({ premium })
      .eq('id', agentId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update agent',
        variant: 'destructive',
      });
    } else {
      toast({
        title: premium ? 'Premium status added' : 'Premium status removed',
      });
      fetchData();
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || 
      agent.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating ? "fill-primary text-primary" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );

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
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-muted-foreground">Manage agents and platform analytics</p>
            </div>
            
            {pendingAgents.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-amber-600">
                  {pendingAgents.length} pending approvals
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalAgents}</p>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/10 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.activeAgents}</p>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                </div>
                <div className="bg-card border border-border/50 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                      <Users className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Platform Status</h2>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <p className="font-medium text-green-600">Free for now</p>
                  <p className="text-sm text-muted-foreground">No payment integration active</p>
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
              
              {pendingAgents.length > 0 ? (
                <div className="space-y-4">
                  {pendingAgents.map((agent) => (
                    <div key={agent.id} className="p-5 bg-muted/30 rounded-xl">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {agent.full_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <h3 className="font-semibold">{agent.full_name}</h3>
                            <p className="text-sm text-primary">{agent.categories?.[0] || 'No category'}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {agent.city || agent.state || 'Location not set'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Applied: {new Date(agent.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="rounded-lg"
                            onClick={() => handleVerifyAgent(agent.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="rounded-lg border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                            onClick={() => handleSetPremium(agent.id, true)}
                          >
                            <Crown className="h-4 w-4 mr-1" />
                            Premium
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BadgeCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No pending approvals</p>
                </div>
              )}
            </div>
          )}

          {/* All Agents Tab */}
          {activeTab === "agents" && (
            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      {AGENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">Agent</th>
                        <th className="text-left p-4 font-medium text-sm">Category</th>
                        <th className="text-left p-4 font-medium text-sm">Location</th>
                        <th className="text-left p-4 font-medium text-sm">Status</th>
                        <th className="text-left p-4 font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent) => (
                        <tr key={agent.id} className="border-t border-border/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {agent.full_name?.charAt(0) || 'A'}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{agent.full_name}</span>
                                  {agent.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                                  {agent.premium && <Crown className="h-4 w-4 text-amber-500" />}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{agent.categories?.[0] || 'N/A'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">{agent.city || agent.state || 'N/A'}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant={agent.available ? "default" : "secondary"} className="rounded-lg">
                              {agent.available ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant={agent.verified ? "outline" : "default"}
                                className="rounded-lg"
                                onClick={() => handleVerifyAgent(agent.id, !agent.verified)}
                              >
                                <BadgeCheck className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant={agent.premium ? "outline" : "ghost"}
                                className={`rounded-lg ${agent.premium ? 'text-amber-600' : ''}`}
                                onClick={() => handleSetPremium(agent.id, !agent.premium)}
                              >
                                <Crown className="h-3.5 w-3.5" />
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
