import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react"
import { Mail, User, Clock, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Phone,
  BadgeCheck,
  Crown,
  TrendingUp,
  Edit,
  Save,
  Circle,
  History,
  Loader2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  INDIA_STATES,
  STATE_DISTRICTS,
  AGENT_CATEGORIES,
} from "@/data/indiaLocations";

interface AgentData {
  id: string;
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
  rejected: boolean | null;
  rejection_reason: string | null;
  rejected_at: string | null;
}

interface CustomerProfile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface CallData {
  id: string;
  customer_id: string;
  duration_seconds: number | null;
  category: string | null;
  status: string | null;
  scheduled_at: string | null;
  notes: string | null;
  created_at: string;
  customer_profile: CustomerProfile;
}

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [calls, setCalls] = useState<CallData[]>([]);
  const [reviews, setReviews] = useState<{ stars: number }[]>([]);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    description: "",
    offers: "",
    state: "",
    city: "",
    area: "",
    pincode: "",
    categories: [] as string[],
  });

  useEffect(() => {
    if (user) {
      fetchAgentData();
    }
  }, [user]);

  const fetchAgentData = async () => {
    if (!user) return;

    try {
      const { data: agent, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (agent) {
        setAgentData(agent);
        setFormData({
          full_name: agent.full_name || "",
          phone: agent.phone || "",
          description: agent.description || "",
          offers: agent.offers || "",
          state: agent.state || "",
          city: agent.city || "",
          area: agent.area || "",
          pincode: agent.pincode || "",
          categories: agent.categories || [],
        });
        if (agent.avatar_url) {
          setPreviewUrl(agent.avatar_url);
        }

        // Fetch calls
        // Fetch calls with customer profile information
     // Fetch calls with customer profile information
const { data: callsData, error: callsError } = await supabase
.from('calls')
.select('*')
.eq('agent_id', agent.id)
.order('created_at', { ascending: false })
.limit(20);

if (callsError) {
console.error('Error fetching calls:', callsError);
} else if (callsData) {
// Fetch customer profiles separately
const customerIds = [...new Set(callsData.map(call => call.customer_id))];
const { data: profilesData } = await supabase
  .from('profiles')
  .select('user_id, full_name, email, phone')
  .in('user_id', customerIds);

// Create a map of customer profiles
const profilesMap = new Map(
  profilesData?.map(profile => [profile.user_id, profile]) || []
);

// Combine calls with profiles
const transformedCalls: CallData[] = callsData.map(call => ({
  id: call.id,
  customer_id: call.customer_id,
  duration_seconds: call.duration_seconds,
  category: call.category,
  // @ts-ignore
  status: call.status,
  // @ts-ignore
  scheduled_at: call.scheduled_at,
  // @ts-ignore
  notes: call.notes,
  created_at: call.created_at,
  customer_profile: profilesMap.get(call.customer_id) || { 
    full_name: null, 
    email: null, 
    phone: null 
  }
}));

setCalls(transformedCalls);
}

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("stars")
          .eq("agent_id", agent.id);

        if (reviewsData) setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      toast({
        title: "Error",
        description: "Failed to load agent data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!agentData) return;

    const newAvailable = !agentData.available;

    const { error } = await supabase
      .from("agents")
      .update({ available: newAvailable })
      .eq("id", agentData.id);

    if (!error) {
      setAgentData({ ...agentData, available: newAvailable });
      toast({
        title: newAvailable
          ? "You are now available"
          : "You are now unavailable",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !agentData) return;
    
    const file = e.target.files[0];
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      // @ts-ignore
      const fileName = `${agentData.user_id}/${Date.now()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update agent profile
      const { error: updateError } = await supabase
        .from('agents')
        .update({ avatar_url: publicUrl })
        .eq('id', agentData.id);
      
      if (updateError) throw updateError;
      
      setAgentData({ ...agentData, avatar_url: publicUrl });
      setPreviewUrl(publicUrl);
      
      toast({
        title: "Profile image updated",
        description: "Your profile image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemoveImage = async () => {
    if (!agentData) return;
    
    setUploading(true);
    
    try {
      const { error } = await supabase
        .from('agents')
        .update({ avatar_url: null })
        .eq('id', agentData.id);
      
      if (error) throw error;
      
      setAgentData({ ...agentData, avatar_url: null });
      setPreviewUrl(null);
      
      toast({
        title: "Image removed",
        description: "Your profile image has been removed",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!agentData) return;

    setSaving(true);

    const isProfileComplete =
      formData.full_name &&
      formData.phone &&
      formData.state &&
      formData.city &&
      formData.categories.length > 0;

    const { error } = await supabase
      .from("agents")
      .update({
        ...formData,
        profile_complete: isProfileComplete,
      })
      .eq("id", agentData.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } else {
      setAgentData({
        ...agentData,
        ...formData,
        profile_complete: isProfileComplete,
      });
      setIsEditing(false);
      toast({
        title: "Profile saved",
        description: isProfileComplete
          ? "Your profile is now visible to customers"
          : "Complete all required fields to appear in listings",
      });
    }

    setSaving(false);
  };

  const handleReapply = async () => {
    if (!agentData) return;

    setSaving(true);

    const { error } = await supabase
      .from("agents")
      .update({
        rejected: false,
        rejection_reason: null,
        rejected_at: null,
      })
      .eq("id", agentData.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit re-application",
        variant: "destructive",
      });
    } else {
      setAgentData({
        ...agentData,
        rejected: false,
        rejection_reason: null,
        rejected_at: null,
      });
      toast({
        title: "Re-application submitted",
        description: "Your profile is now pending review again",
      });
    }

    setSaving(false);
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      scheduled: {
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        label: "Scheduled",
      },
      ongoing: {
        color: "bg-green-500/10 text-green-600 border-green-500/20",
        label: "Ongoing",
      },
      completed: {
        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        label: "Cancelled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.completed;

    return (
      <span
        className={`px-2 py-1 rounded-lg text-xs font-medium border ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-primary text-primary"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );

  const districts = formData.state ? STATE_DISTRICTS[formData.state] || [] : [];

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
              <h1 className="text-2xl sm:text-3xl font-bold">
                Agent Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your profile and leads
              </p>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-3 w-3 ${
                    agentData?.available
                      ? "fill-green-500 text-green-500"
                      : "fill-muted-foreground text-muted-foreground"
                  }`}
                />
                <span className="font-medium">
                  {agentData?.available
                    ? "Available Now"
                    : "Currently Unavailable"}
                </span>
              </div>
              <Switch
                checked={agentData?.available || false}
                onCheckedChange={handleToggleAvailability}
                disabled={!agentData?.profile_complete}
              />
            </div>
          </div>

          {agentData?.rejected && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-destructive font-medium">
                    Your application was rejected
                  </p>
                  {agentData.rejection_reason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Reason:</strong> {agentData.rejection_reason}
                    </p>
                  )}
                  {agentData.rejected_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Rejected on:{" "}
                      {new Date(agentData.rejected_at).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Please update your profile to address the issue and
                    re-apply.
                  </p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={handleReapply}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Re-apply for Approval
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!agentData?.profile_complete && !agentData?.rejected && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-600 font-medium">
                Complete your profile to appear in agent listings
              </p>
              <p className="text-sm text-muted-foreground">
                Fill in all required fields: name, phone, location, and at least
                one category
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Statistics</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-primary">
                      {calls.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Calls</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold">{reviews.length}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <div className="flex justify-center mb-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Call History */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Recent Enquiries & Leads
                  </h2>
                </div>
                {calls.length > 0 ? (
                  <div className="space-y-3">
                    {calls.map((call) => (
                      <div
                        key={call.id}
                        className="border border-border/50 rounded-xl overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            setExpandedCall(
                              expandedCall === call.id ? null : call.id
                            )
                          }
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">
                                  {call.customer_profile?.full_name ||
                                    "Customer"}
                                </p>
                                {getStatusBadge(call.status)}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {call.category || "General Inquiry"} •{" "}
                                {new Date(call.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {call.duration_seconds
                                ? `${Math.round(
                                    call.duration_seconds / 60
                                  )} min`
                                : "View details"}
                            </p>
                          </div>
                        </div>

                        {expandedCall === call.id && (
                          <div className="p-4 bg-card border-t border-border/50 space-y-3">
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Customer Name
                                  </p>
                                  <p className="text-sm font-medium">
                                    {call.customer_profile?.full_name ||
                                      "Not provided"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Email
                                  </p>
                                  <p className="text-sm font-medium">
                                    {call.customer_profile?.email ||
                                      "Not provided"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Phone
                                  </p>
                                  <p className="text-sm font-medium">
                                    {call.customer_profile?.phone ||
                                      "Not provided"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Duration
                                  </p>
                                  <p className="text-sm font-medium">
                                    {call.duration_seconds
                                      ? `${Math.floor(
                                          call.duration_seconds / 60
                                        )}m ${call.duration_seconds % 60}s`
                                      : "Not recorded"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {call.scheduled_at && (
                              <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-xs text-muted-foreground">
                                    Scheduled For
                                  </p>
                                  <p className="text-sm font-medium">
                                    {new Date(
                                      call.scheduled_at
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}

                            {call.notes && (
                              <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Notes
                                </p>
                                <p className="text-sm">{call.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No enquiries yet</p>
                    <p className="text-xs mt-1">
                      Complete your profile to start receiving leads
                    </p>
                  </div>
                )}
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
                    onClick={() =>
                      isEditing ? handleSaveProfile() : setIsEditing(true)
                    }
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      State *
                    </label>
                    <Select
                      value={formData.state}
                      onValueChange={(val) =>
                        setFormData({ ...formData, state: val, city: "" })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {INDIA_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      City/District *
                    </label>
                    <Select
                      value={formData.city}
                      onValueChange={(val) =>
                        setFormData({ ...formData, city: val })
                      }
                      disabled={!isEditing || !formData.state}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {districts.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Area / Locality
                    </label>
                    <Input
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Pincode
                    </label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Categories *
                    </label>
                    <Select
                      value={formData.categories[0] || ""}
                      onValueChange={(val) =>
                        setFormData({ ...formData, categories: [val] })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {AGENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Bio / Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="rounded-xl resize-none"
                      rows={3}
                      placeholder="Tell customers about your expertise..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Offers / Discounts
                    </label>
                    <Input
                      value={formData.offers}
                      onChange={(e) =>
                        setFormData({ ...formData, offers: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="e.g., 10% off first order"
                      className="rounded-xl"
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
                  <div className="relative group">
  {previewUrl ? (
    <img 
      src={previewUrl} 
      alt="Profile" 
      className="w-24 h-24 rounded-2xl object-cover"
    />
  ) : (
    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
      {formData.full_name?.charAt(0) || "A"}
    </div>
  )}
  
  {isEditing && (
    <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
      <label className="cursor-pointer p-2 bg-white rounded-full hover:bg-gray-100">
        <Upload className="h-4 w-4 text-black" />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {previewUrl && (
        <button
          onClick={handleRemoveImage}
          disabled={uploading}
          className="p-2 bg-white rounded-full hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-black" />
        </button>
      )}
    </div>
  )}
  
  {uploading && (
    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-white" />
    </div>
  )}
</div>
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                        agentData?.available
                          ? "bg-green-500"
                          : "bg-muted-foreground/50"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      {formData.full_name || "Your Name"}
                    </h3>
                    {agentData?.verified && (
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    )}
                    {agentData?.premium && (
                      <Crown className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-primary text-sm font-medium">
                    {formData.categories[0] || "Select category"}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Rating
                    </span>
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Total Calls
                    </span>
                    <span className="font-semibold">{calls.length}</span>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Verification Status</h3>
                </div>
                {agentData?.verified ? (
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-600">
                        Verified Agent
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your identity is verified
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-sm text-amber-600">
                      Pending verification
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete your profile to get verified
                    </p>
                  </div>
                )}
              </div>

              {/* Premium Status */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold">Premium Status</h3>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm font-medium">Free for now</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Premium features coming soon
                  </p>
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

export default AgentDashboard;
