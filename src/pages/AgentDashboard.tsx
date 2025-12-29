import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  Phone,
  BadgeCheck,
  Crown,
  TrendingUp,
  Edit,
  Save,
  Circle,
  History,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { INDIA_STATES, STATE_DISTRICTS, AGENT_CATEGORIES } from "@/data/indiaLocations";

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
}

interface CallData {
  id: string;
  customer_id: string;
  duration_seconds: number | null;
  category: string | null;
  created_at: string;
}

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [calls, setCalls] = useState<CallData[]>([]);
  const [reviews, setReviews] = useState<{ stars: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    description: '',
    offers: '',
    state: '',
    city: '',
    area: '',
    pincode: '',
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
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (agent) {
        setAgentData(agent);
        setFormData({
          full_name: agent.full_name || '',
          phone: agent.phone || '',
          description: agent.description || '',
          offers: agent.offers || '',
          state: agent.state || '',
          city: agent.city || '',
          area: agent.area || '',
          pincode: agent.pincode || '',
          categories: agent.categories || [],
        });

        // Fetch calls
        const { data: callsData } = await supabase
          .from('calls')
          .select('*')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (callsData) setCalls(callsData);

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('stars')
          .eq('agent_id', agent.id);
        
        if (reviewsData) setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agent data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!agentData) return;
    
    const newAvailable = !agentData.available;
    
    const { error } = await supabase
      .from('agents')
      .update({ available: newAvailable })
      .eq('id', agentData.id);
    
    if (!error) {
      setAgentData({ ...agentData, available: newAvailable });
      toast({
        title: newAvailable ? 'You are now available' : 'You are now unavailable',
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!agentData) return;
    
    setSaving(true);
    
    const isProfileComplete = formData.full_name && formData.phone && 
      formData.state && formData.city && formData.categories.length > 0;
    
    const { error } = await supabase
      .from('agents')
      .update({
        ...formData,
        profile_complete: isProfileComplete,
      })
      .eq('id', agentData.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } else {
      setAgentData({ 
        ...agentData, 
        ...formData, 
        profile_complete: isProfileComplete 
      });
      setIsEditing(false);
      toast({
        title: 'Profile saved',
        description: isProfileComplete ? 'Your profile is now visible to customers' : 'Complete all required fields to appear in listings',
      });
    }
    
    setSaving(false);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length 
    : 0;

  const renderStars = (rating: number) => (
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
              <h1 className="text-2xl sm:text-3xl font-bold">Agent Dashboard</h1>
              <p className="text-muted-foreground">Manage your profile and leads</p>
            </div>
            
            {/* Availability Toggle */}
            <div className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Circle className={`h-3 w-3 ${agentData?.available ? "fill-green-500 text-green-500" : "fill-muted-foreground text-muted-foreground"}`} />
                <span className="font-medium">{agentData?.available ? "Available Now" : "Currently Unavailable"}</span>
              </div>
              <Switch
                checked={agentData?.available || false}
                onCheckedChange={handleToggleAvailability}
                disabled={!agentData?.profile_complete}
              />
            </div>
          </div>

          {!agentData?.profile_complete && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-600 font-medium">Complete your profile to appear in agent listings</p>
              <p className="text-sm text-muted-foreground">Fill in all required fields: name, phone, location, and at least one category</p>
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
                    <p className="text-2xl font-bold text-primary">{calls.length}</p>
                    <p className="text-sm text-muted-foreground">Total Calls</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <p className="text-2xl font-bold">{reviews.length}</p>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl text-center">
                    <div className="flex justify-center mb-1">{renderStars(Math.round(averageRating))}</div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </div>

              {/* Call History */}
              <div className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <History className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Recent Leads / Calls</h2>
                </div>
                {calls.length > 0 ? (
                  <div className="space-y-4">
                    {calls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{call.category || 'General Inquiry'}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(call.created_at).toLocaleDateString()} • 
                              {call.duration_seconds ? ` ${Math.round(call.duration_seconds / 60)} min` : ' Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No calls yet</p>
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
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
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
                    <label className="text-sm text-muted-foreground mb-2 block">Full Name *</label>
                    <Input 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Phone Number *</label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">State *</label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(val) => setFormData({...formData, state: val, city: ''})} 
                      disabled={!isEditing}
                    >
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
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">City/District *</label>
                    <Select 
                      value={formData.city} 
                      onValueChange={(val) => setFormData({...formData, city: val})} 
                      disabled={!isEditing || !formData.state}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {districts.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Area / Locality</label>
                    <Input 
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Pincode</label>
                    <Input 
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">Categories *</label>
                    <Select 
                      value={formData.categories[0] || ''} 
                      onValueChange={(val) => setFormData({...formData, categories: [val]})} 
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {AGENT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">Bio / Description</label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      disabled={!isEditing}
                      className="rounded-xl resize-none"
                      rows={3}
                      placeholder="Tell customers about your expertise..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-muted-foreground mb-2 block">Offers / Discounts</label>
                    <Input 
                      value={formData.offers}
                      onChange={(e) => setFormData({...formData, offers: e.target.value})}
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
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {formData.full_name?.charAt(0) || 'A'}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                      agentData?.available ? "bg-green-500" : "bg-muted-foreground/50"
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{formData.full_name || 'Your Name'}</h3>
                    {agentData?.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                    {agentData?.premium && <Crown className="h-5 w-5 text-amber-500" />}
                  </div>
                  <p className="text-primary text-sm font-medium">{formData.categories[0] || 'Select category'}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <span className="text-sm text-muted-foreground">Total Calls</span>
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
                      <span className="font-medium text-green-600">Verified Agent</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Your identity is verified</p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-sm text-amber-600">Pending verification</p>
                    <p className="text-xs text-muted-foreground mt-1">Complete your profile to get verified</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Premium features coming soon</p>
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
