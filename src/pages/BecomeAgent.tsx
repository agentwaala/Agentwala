import { useState } from "react";
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
import { CheckCircle2, Upload, ArrowRight, ArrowLeft, Shield, Users, DollarSign, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const domains = [
  "Real Estate", "Tourism", "PCs & Tech", "Fashion", "Education", 
  "Business", "Healthcare", "Legal", "Automotive", "Photography",
  "Music", "Art & Design", "Fitness", "Interior Design", "Culinary", "Childcare"
];

const benefits = [
  { icon: Shield, title: "Get Verified", description: "Stand out with our verified badge" },
  { icon: Users, title: "Quality Leads", description: "Connect with genuine clients" },
  { icon: DollarSign, title: "Grow Revenue", description: "Expand your client base" },
  { icon: Clock, title: "Flexible Hours", description: "Work on your own schedule" },
];

const BecomeAgent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    domain: "",
    experience: "",
    description: "",
    location: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: "Your application is under review. We'll get back to you within 48 hours.",
    });
    setStep(4);
  };

  const canProceed = () => {
    if (step === 1) return formData.fullName && formData.email && formData.phone;
    if (step === 2) return formData.domain && formData.experience;
    if (step === 3) return formData.description && formData.location;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-12 sm:py-20 border-b border-border/40">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4">Join 500+ Verified Agents</Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Become an <span className="text-primary">Agent</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Share your expertise with thousands of users looking for trusted professionals.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
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

              {/* Form */}
              {step < 4 ? (
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
                  {step === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
                        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name</label>
                          <Input
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email</label>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Phone Number</label>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">Professional Details</h2>
                        <p className="text-sm text-muted-foreground">Your area of expertise</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Select Domain</label>
                          <Select
                            value={formData.domain}
                            onValueChange={(value) => handleInputChange("domain", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your domain" />
                            </SelectTrigger>
                            <SelectContent>
                              {domains.map((domain) => (
                                <SelectItem key={domain} value={domain}>
                                  {domain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => handleInputChange("experience", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                            <SelectContent>
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
                        <h2 className="text-xl font-semibold mb-1">Additional Information</h2>
                        <p className="text-sm text-muted-foreground">Help clients know you better</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">About You</label>
                          <Textarea
                            placeholder="Describe your expertise, experience, and what makes you unique..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Location</label>
                          <Input
                            placeholder="City, Country"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Profile Photo (Optional)</label>
                          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
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
                      <Button type="submit" disabled={!canProceed()} className="neon-glow">
                        Submit Application
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              ) : (
                /* Success State */
                <div className="glass-card rounded-2xl p-8 text-center animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your application is under review by our admin team. We'll get back to you within 48 hours.
                  </p>
                  <Badge variant="secondary" className="text-sm px-4 py-2">
                    Status: Pending Approval
                  </Badge>
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
