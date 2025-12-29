import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AGENT_CATEGORIES, INDIA_STATES, STATE_DISTRICTS } from "@/data/indiaLocations";

const benefits = [
  { icon: Shield, title: "Get Verified", description: "Stand out with our verified badge" },
  { icon: Users, title: "Quality Leads", description: "Connect with genuine clients" },
  { icon: DollarSign, title: "Grow Revenue", description: "Expand your client base" },
  { icon: Clock, title: "Flexible Hours", description: "Work on your own schedule" },
];

const becomeAgentSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  domain: z.string().trim().min(1),
  experience: z.string().trim().min(1),
  description: z.string().trim().min(20).max(1000),
  state: z.string().trim().min(1),
  city: z.string().trim().min(1),
  area: z.string().trim().max(120).optional(),
  pincode: z.string().trim().max(10).optional(),
});

type BecomeAgentForm = z.infer<typeof becomeAgentSchema>;

const BecomeAgent = () => {
  const navigate = useNavigate();
  const { user, setUserRole } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BecomeAgentForm>({
    fullName: "",
    phone: "",
    domain: "",
    experience: "",
    description: "",
    state: "",
    city: "",
    area: "",
    pincode: "",
  });

  const districts = useMemo(
    () => (formData.state ? STATE_DISTRICTS[formData.state] || [] : []),
    [formData.state]
  );

  const update = (field: keyof BecomeAgentForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "state" ? { city: "" } : null),
    }));
  };

  const canProceed = () => {
    if (step === 1) return Boolean(formData.fullName && formData.phone);
    if (step === 2) return Boolean(formData.domain && formData.experience);
    if (step === 3) return Boolean(formData.description && formData.state && formData.city);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = becomeAgentSchema.safeParse(formData);
    if (!parsed.success) {
      toast({
        title: "Please complete all required fields",
        description: "Check your name, phone, category, bio, and location.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit your agent application.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure the user has agent role + agent row exists
      await setUserRole("agent");

      // Keep profile in sync
      await supabase
        .from("profiles")
        .update({ full_name: parsed.data.fullName, phone: parsed.data.phone })
        .eq("user_id", user.id);

      // Save to agent profile (used by admin approval queue)
      const profileComplete = true;
      const { error } = await supabase
        .from("agents")
        .update({
          full_name: parsed.data.fullName,
          phone: parsed.data.phone,
          categories: [parsed.data.domain],
          description: parsed.data.description,
          state: parsed.data.state,
          city: parsed.data.city,
          area: parsed.data.area || null,
          pincode: parsed.data.pincode || null,
          profile_complete: profileComplete,
          available: false,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your profile is now pending admin approval.",
      });

      setStep(4);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <header className="py-12 sm:py-20 border-b border-border/40">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4">Join 500+ Verified Agents</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Become an <span className="text-primary">Agent</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create a complete profile with the correct location so customers can find you easily.
            </p>
          </div>
        </header>

        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-semibold mb-1">{benefit.title}</h2>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all ${
                          step > s ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {step < 4 ? (
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
                        <p className="text-sm text-muted-foreground">Your name and phone will be shown to customers.</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name *</label>
                          <Input
                            value={formData.fullName}
                            onChange={(e) => update("fullName", e.target.value)}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                          <Input
                            value={formData.phone}
                            onChange={(e) => update("phone", e.target.value)}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Professional Details</h2>
                        <p className="text-sm text-muted-foreground">Select your category so we can list you correctly.</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category *</label>
                          <Select value={formData.domain} onValueChange={(v) => update("domain", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose category" />
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
                        <div>
                          <label className="text-sm font-medium mb-2 block">Years of Experience *</label>
                          <Select value={formData.experience} onValueChange={(v) => update("experience", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="1-2">1-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="5-10">5-10 years</SelectItem>
                              <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Profile & Location</h2>
                        <p className="text-sm text-muted-foreground">Accurate location helps customers find you.</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Bio / Description *</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => update("description", e.target.value)}
                            rows={4}
                            placeholder="Describe your expertise, experience, and what you offer..."
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">State *</label>
                            <Select value={formData.state} onValueChange={(v) => update("state", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                {INDIA_STATES.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">City/District *</label>
                            <Select
                              value={formData.city}
                              onValueChange={(v) => update("city", v)}
                              disabled={!formData.state}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                {districts.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Area / Locality</label>
                            <Input
                              value={formData.area || ""}
                              onChange={(e) => update("area", e.target.value)}
                              placeholder="e.g., Andheri West"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Pincode</label>
                            <Input
                              value={formData.pincode || ""}
                              onChange={(e) => update("pincode", e.target.value)}
                              placeholder="e.g., 400001"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Profile Photo (Optional)</label>
                          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload coming soon</p>
                          </div>
                        </div>
                      </div>
                  
                    </div>
                  )}

                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    {step > 1 ? (
                      <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed()}
                        className="neon-glow"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={!canProceed() || isSubmitting} className="neon-glow">
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                  <p className="text-muted-foreground mb-6">Your application is under review by our admin team.</p>
                  <Badge variant="secondary" className="text-sm px-4 py-2">Status: Pending Approval</Badge>

                  <div className="mt-6">
                    <Button onClick={() => navigate("/agent-dashboard")}>
                      Go to Agent Dashboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeAgent;
