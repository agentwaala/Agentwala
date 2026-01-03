import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Phone,
  Calendar,
  Clock,
  Eye,
  Star,
  MapPin,
  BadgeCheck,
  Crown,
  Users,
  TrendingUp,
  Search,
  Check,
  X,
  Filter,
  BarChart3,
  Shield,
  Loader2,
  RotateCcw,
  Mail,
  Building2,
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
  area: string | null;
  pincode: string | null;
  description: string | null;
  offers: string | null;
  available: boolean;
  verified: boolean;
  premium: boolean;
  profile_complete: boolean;
  rejected: boolean;
  rejection_reason: string | null;
  rejected_at: string | null;
  created_at: string;
  email?: string;
}

interface CallData {
  id: string;
  customer_id: string;
  agent_id: string;
  duration_seconds: number | null;
  category: string | null;
  scheduled_at: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  agent_name?: string;
}

interface AgentUsageStats {
  agent_id: string;
  agent_name: string;
  total_calls: number;
  unique_customers: number;
  total_duration_minutes: number;
  scheduled_calls: number;
  completed_calls: number;
  reviews_count: number;
  avg_rating: number;
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [pendingAgents, setPendingAgents] = useState<AgentData[]>([]);
  const [calls, setCalls] = useState<CallData[]>([]);
  const [agentUsageStats, setAgentUsageStats] = useState<AgentUsageStats[]>([]);
  const [selectedAgentForDetails, setSelectedAgentForDetails] = useState<
    string | null
  >(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgents: 0,
    activeAgents: 0,
    totalCustomers: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeTab, setActiveTab] = useState<
    "overview" | "approvals" | "agents" | "usage"
  >("overview");
  
  // Rejection dialog state
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingAgent, setRejectingAgent] = useState<AgentData | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Agent details dialog state
  const [agentDetailsDialogOpen, setAgentDetailsDialogOpen] = useState(false);
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<AgentData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all agents
      const { data: agentsData, error: agentsError } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (agentsError) throw agentsError;

      // Fetch profiles to get emails
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, email");

      const emailMap = new Map(
        profilesData?.map((p) => [p.user_id, p.email]) || []
      );

      if (agentsData) {
        const agentsWithEmail = agentsData.map((agent) => ({
          ...agent,
          email: emailMap.get(agent.user_id) || undefined,
        })) as AgentData[];

        setAgents(agentsWithEmail);
        setPendingAgents(
          agentsWithEmail.filter((a) => !a.verified && !a.rejected)
        );
      }

      // Fetch all calls
      const { data: callsData, error: callsError } = await supabase
        .from("calls")
        .select("*")
        .order("created_at", { ascending: false });

      if (callsError) {
        console.error("Calls fetch error:", callsError);
      }

      if (callsData && callsData.length > 0) {
        // Get unique customer and agent IDs
        const customerIds = [...new Set(callsData.map((c) => c.customer_id))];
        const agentIds = [...new Set(callsData.map((c) => c.agent_id))];

        // Fetch customer profiles
        const { data: customerProfiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", customerIds);

        // Fetch agent details
        const { data: agentProfiles } = await supabase
          .from("agents")
          .select("id, full_name")
          .in("id", agentIds);

        // Create lookup maps
        const customerMap = new Map(
          customerProfiles?.map((p) => [
            p.user_id,
            { name: p.full_name, email: p.email },
          ]) || []
        );
        const agentMap = new Map(
          agentProfiles?.map((a) => [a.id, a.full_name]) || []
        );

        // Format calls with customer and agent details
        const formattedCalls = callsData.map((call) => ({
          id: call.id,
          customer_id: call.customer_id,
          agent_id: call.agent_id,
          duration_seconds: call.duration_seconds,
          category: call.category,
          // @ts-ignore
          scheduled_at: call.scheduled_at,
          // @ts-ignore
          status: call.status,
          // @ts-ignore
          notes: call.notes,
          created_at: call.created_at,
          customer_name: customerMap.get(call.customer_id)?.name,
          customer_email: customerMap.get(call.customer_id)?.email,
          agent_name: agentMap.get(call.agent_id),
        }));

        setCalls(formattedCalls);
      } else {
        setCalls([]);
      }

      // Fetch reviews for ratings
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("agent_id, stars");

      // Calculate usage stats
      const usageMap = new Map<string, AgentUsageStats>();

      if (agentsData) {
        agentsData.forEach((agent) => {
          const agentCalls =
            callsData?.filter((c: any) => c.agent_id === agent.id) || [];
          const uniqueCustomers = new Set(
            agentCalls.map((c: any) => c.customer_id)
          ).size;
          const totalDuration = agentCalls.reduce(
            (sum, c: any) => sum + (c.duration_seconds || 0),
            0
          );

          const agentReviews =
            reviewsData?.filter((r) => r.agent_id === agent.id) || [];
          const avgRating =
            agentReviews.length > 0
              ? agentReviews.reduce((sum, r) => sum + r.stars, 0) /
                agentReviews.length
              : 0;

          usageMap.set(agent.id, {
            agent_id: agent.id,
            agent_name: agent.full_name,
            total_calls: agentCalls.length,
            unique_customers: uniqueCustomers,
            total_duration_minutes: Math.round(totalDuration / 60),
            scheduled_calls: agentCalls.filter(
              (c: any) => c.status === "scheduled"
            ).length,
            completed_calls: agentCalls.filter(
              (c: any) => c.status === "completed"
            ).length,
            reviews_count: agentReviews.length,
            avg_rating: Math.round(avgRating * 10) / 10,
          });
        });
      }

      setAgentUsageStats(Array.from(usageMap.values()));

      // Get counts
      const { count: profileCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: customerCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer");

      setStats({
        totalUsers: profileCount || 0,
        totalAgents: agentsData?.length || 0,
        activeAgents: agentsData?.filter((a) => a.available).length || 0,
        totalCustomers: customerCount || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (
    type: "approved" | "rejected",
    agentEmail: string,
    agentName: string,
    rejectionReason?: string
  ) => {
    try {
      const { error } = await supabase.functions.invoke(
        "send-agent-notification",
        {
          body: { type, agentEmail, agentName, rejectionReason },
        }
      );
      if (error) {
        console.error("Failed to send notification:", error);
      }
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  const handleVerifyAgent = async (agentId: string, verified: boolean) => {
    const agent = agents.find((a) => a.id === agentId);

    const { error } = await supabase
      .from("agents")
      .update({ verified })
      .eq("id", agentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    } else {
      toast({
        title: verified ? "Agent verified" : "Agent unverified",
      });

      // Send approval notification
      if (verified && agent?.email) {
        sendNotification("approved", agent.email, agent.full_name);
      }

      fetchData();
    }
  };

  const handleSetPremium = async (agentId: string, premium: boolean) => {
    const { error } = await supabase
      .from("agents")
      .update({ premium })
      .eq("id", agentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    } else {
      toast({
        title: premium ? "Premium status added" : "Premium status removed",
      });
      fetchData();
    }
  };

  const handleUnrejectAgent = async (agentId: string, agentName: string) => {
    const { error } = await supabase
      .from("agents")
      .update({
        rejected: false,
        rejection_reason: null,
        rejected_at: null,
      })
      .eq("id", agentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to restore agent",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Agent restored",
        description: `${agentName} has been moved back to the approval queue.`,
      });
      fetchData();
    }
  };

  const openRejectDialog = (agent: AgentData) => {
    setRejectingAgent(agent);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const openAgentDetailsDialog = (agent: AgentData) => {
    setSelectedAgentDetails(agent);
    setAgentDetailsDialogOpen(true);
  };

  const handleRejectAgent = async () => {
    if (!rejectingAgent) return;
  
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this agent.",
        variant: "destructive",
      });
      return;
    }
  
    setIsRejecting(true);
  
    try {
      const { error } = await supabase
        .from("agents")
        .update({
          rejected: true,
          rejection_reason: rejectionReason.trim(),
          rejected_at: new Date().toISOString(),
        })
        .eq("id", rejectingAgent.id);
  
      if (error) {
        console.error("❌ Rejection error:", error);
        toast({
          title: "Error",
          description: `Failed to reject agent: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
  
      toast({
        title: "Agent rejected",
        description: `${rejectingAgent.full_name} has been rejected.`,
      });
  
      // Send rejection notification
      if (rejectingAgent.email) {
        await sendNotification(
          "rejected",
          rejectingAgent.email,
          rejectingAgent.full_name,
          rejectionReason.trim()
        );
      }
  
      setRejectDialogOpen(false);
      setRejectingAgent(null);
      setRejectionReason("");
      await fetchData();
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.full_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      agent.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getAgentCalls = (agentId: string) => {
    return calls.filter((c) => c.agent_id === agentId);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
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
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage agents and platform analytics
              </p>
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
              { id: "usage", label: "Usage Analytics", icon: TrendingUp },
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
                  <p className="text-sm text-muted-foreground">
                    No payment integration active
                  </p>
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
                          {agent.avatar_url ? (
                            <img
                              src={agent.avatar_url}
                              alt={agent.full_name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {agent.full_name?.charAt(0) || "A"}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{agent.full_name}</h3>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 rounded-lg"
                                onClick={() => openAgentDetailsDialog(agent)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="text-sm text-primary">
                              {agent.categories?.[0] || "No category"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                              <Badge
                                variant={
                                  agent.profile_complete
                                    ? "default"
                                    : "secondary"
                                }
                                className="rounded-lg"
                              >
                                {agent.profile_complete
                                  ? "Profile complete"
                                  : "Profile incomplete"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {agent.city || agent.state || "Location not set"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Applied:{" "}
                              {new Date(agent.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                            onClick={() => openRejectDialog(agent)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-lg"
                            onClick={() => handleVerifyAgent(agent.id, true)}
                            disabled={!agent.profile_complete}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                            onClick={() => handleSetPremium(agent.id, true)}
                            disabled={!agent.profile_complete}
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
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-48 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="All Categories">
                        All Categories
                      </SelectItem>
                      {AGENT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
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
                        <th className="text-left p-4 font-medium text-sm">
                          Agent
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Category
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Location
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Status
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent) => (
                        <tr
                          key={agent.id}
                          className="border-t border-border/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {agent.avatar_url ? (
                                <img
                                  src={agent.avatar_url}
                                  alt={agent.full_name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                  {agent.full_name?.charAt(0) || "A"}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => openAgentDetailsDialog(agent)}
                                    className="font-medium hover:text-primary transition-colors"
                                  >
                                    {agent.full_name}
                                  </button>
                                  {agent.verified && (
                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                  )}
                                  {agent.premium && (
                                    <Crown className="h-4 w-4 text-amber-500" />
                                  )}
                                  {agent.rejected && (
                                    <Badge
                                      variant="destructive"
                                      className="ml-2 text-xs"
                                    >
                                      Rejected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">
                              {agent.categories?.[0] || "N/A"}
                            </span></td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">
                              {agent.city || agent.state || "N/A"}
                            </span>
                          </td>
                          <td className="p-4">
                            {agent.rejected ? (
                              <Badge
                                variant="destructive"
                                className="rounded-lg"
                              >
                                Rejected
                              </Badge>
                            ) : (
                              <Badge
                                variant={
                                  agent.available ? "default" : "secondary"
                                }
                                className="rounded-lg"
                              >
                                {agent.available ? "Active" : "Inactive"}
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {agent.rejected ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={() =>
                                    handleUnrejectAgent(
                                      agent.id,
                                      agent.full_name
                                    )
                                  }
                                >
                                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                  Restore
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant={
                                      agent.verified ? "outline" : "default"
                                    }
                                    className="rounded-lg"
                                    onClick={() =>
                                      handleVerifyAgent(
                                        agent.id,
                                        !agent.verified
                                      )
                                    }
                                  >
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      agent.premium ? "outline" : "ghost"
                                    }
                                    className={`rounded-lg ${
                                      agent.premium ? "text-amber-600" : ""
                                    }`}
                                    onClick={() =>
                                      handleSetPremium(agent.id, !agent.premium)
                                    }
                                  >
                                    <Crown className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
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

          {/* Usage Analytics Tab */}
          {activeTab === "usage" && (
            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Agent Usage Statistics
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-sm">
                          Agent
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Total Calls
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Unique Customers
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Total Duration
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Reviews
                        </th>
                        <th className="text-left p-4 font-medium text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentUsageStats.map((stat) => {
                        const agent = agents.find((a) => a.id === stat.agent_id);
                        return (
                          <tr
                            key={stat.agent_id}
                            className="border-t border-border/50"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {agent?.avatar_url ? (
                                  <img
                                    src={agent.avatar_url}
                                    alt={stat.agent_name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {stat.agent_name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium flex items-center gap-1.5">
                                    {stat.agent_name}
                                    {agent?.verified && (
                                      <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                                    )}
                                    {agent?.premium && (
                                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">
                                  {stat.total_calls}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({stat.completed_calls} done,{" "}
                                  {stat.scheduled_calls} pending)
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">
                                  {stat.unique_customers}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">
                                  {stat.total_duration_minutes}m
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              {stat.reviews_count > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {stat.avg_rating.toFixed(1)}
                                  </span>
                                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                  <span className="text-xs text-muted-foreground">
                                    ({stat.reviews_count})
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  No reviews
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-lg"
                                onClick={() => {
                                  setSelectedAgentForDetails(stat.agent_id);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Agent Call Details Dialog */}
              {selectedAgentForDetails && (
                <Dialog
                  open={!!selectedAgentForDetails}
                  onOpenChange={() => setSelectedAgentForDetails(null)}
                >
                  <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Customer Interactions</DialogTitle>
                      <DialogDescription>
                        All interactions for{" "}
                        {
                          agents.find((a) => a.id === selectedAgentForDetails)
                            ?.full_name
                        }
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      {getAgentCalls(selectedAgentForDetails).length > 0 ? (
                        getAgentCalls(selectedAgentForDetails).map((call) => (
                          <div
                            key={call.id}
                            className="border border-border rounded-xl p-4"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 font-bold">
                                  {call.customer_name?.charAt(0) || "C"}
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {call.customer_name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {call.customer_email}
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  call.status === "completed"
                                    ? "default"
                                    : call.status === "scheduled"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="rounded-lg"
                              >
                                {call.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(
                                  call.scheduled_at || call.created_at
                                )}
                              </div>
                              {call.duration_seconds && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(call.duration_seconds)}
                                </div>
                              )}
                            </div>

                            {call.category && (
                              <div className="mb-2">
                                <Badge variant="outline" className="rounded-lg">
                                  {call.category}
                                </Badge>
                              </div>
                            )}

                            {call.notes && (
                              <div className="text-sm bg-muted/50 rounded-lg p-3 mt-2">
                                <span className="font-semibold">Notes:</span>{" "}
                                {call.notes}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No interactions recorded yet</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Agent</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {rejectingAgent?.full_name}. This
              will be recorded for reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Rejection Reason *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete documentation, invalid phone number, duplicate account..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectAgent}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Reject Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Details Dialog */}
      <Dialog open={agentDetailsDialogOpen} onOpenChange={setAgentDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              Complete profile information for review
            </DialogDescription>
          </DialogHeader>

          {selectedAgentDetails && (
            <div className="space-y-6 mt-4">
              {/* Agent Header */}
              <div className="flex items-start gap-4">
                {selectedAgentDetails.avatar_url ? (
                  <img
                    src={selectedAgentDetails.avatar_url}
                    alt={selectedAgentDetails.full_name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
                    {selectedAgentDetails.full_name?.charAt(0) || "A"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">
                      {selectedAgentDetails.full_name}
                    </h3>
                    {selectedAgentDetails.verified && (
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    )}
                    {selectedAgentDetails.premium && (
                      <Crown className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAgentDetails.categories?.map((cat) => (
                      <Badge key={cat} variant="secondary" className="rounded-lg">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  {selectedAgentDetails.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAgentDetails.email}</span>
                    </div>
                  )}
                  {selectedAgentDetails.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAgentDetails.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Location
                </h4>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    {selectedAgentDetails.area && (
                      <div>{selectedAgentDetails.area}</div>
                    )}
                    {selectedAgentDetails.city && (
                      <div>{selectedAgentDetails.city}</div>
                    )}
                    {selectedAgentDetails.state && (
                      <div>{selectedAgentDetails.state}</div>
                    )}
                    {selectedAgentDetails.pincode && (
                      <div className="text-muted-foreground">
                        PIN: {selectedAgentDetails.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedAgentDetails.description && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                    Description
                  </h4>
                  <p className="text-sm bg-muted/50 rounded-lg p-3">
                    {selectedAgentDetails.description}
                  </p>
                </div>
              )}

              {/* Offers */}
              {selectedAgentDetails.offers && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                    Offers / Services
                  </h4>
                  <p className="text-sm bg-muted/50 rounded-lg p-3">
                    {selectedAgentDetails.offers}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedAgentDetails.profile_complete ? "default" : "secondary"}
                    className="rounded-lg"
                  >
                    {selectedAgentDetails.profile_complete ? "Profile Complete" : "Profile Incomplete"}
                  </Badge>
                  <Badge
                    variant={selectedAgentDetails.available ? "default" : "secondary"}
                    className="rounded-lg"
                  >
                    {selectedAgentDetails.available ? "Available" : "Unavailable"}
                  </Badge>
                  {selectedAgentDetails.rejected && (
                    <Badge variant="destructive" className="rounded-lg">
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rejection Info */}
              {selectedAgentDetails.rejected && selectedAgentDetails.rejection_reason && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                    Rejection Details
                  </h4>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <p className="text-sm font-medium text-destructive mb-1">
                      Reason:
                    </p>
                    <p className="text-sm">{selectedAgentDetails.rejection_reason}</p>
                    {selectedAgentDetails.rejected_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Rejected on: {formatDateTime(selectedAgentDetails.rejected_at)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Account Information
                </h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>Created: {formatDateTime(selectedAgentDetails.created_at)}</p>
                  <p>User ID: {selectedAgentDetails.user_id}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;