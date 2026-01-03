import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Users, Briefcase, CheckCircle, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const SelectRole = () => {
  const { user, role, roleLoading, setUserRole, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'agent' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user already has a role
  useEffect(() => {
    if (!loading && !roleLoading && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'agent') {
        navigate('/agent-dashboard', { replace: true });
      } else {
        navigate('/customer-dashboard', { replace: true });
      }
    }
  }, [role, loading, roleLoading, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user || !termsAccepted) return;

    setIsSubmitting(true);
    try {
      await setUserRole(selectedRole);
      toast({
        title: 'Role selected!',
        description: `You are now registered as a ${selectedRole}`,
      });

      if (selectedRole === 'agent') {
        navigate('/agent-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTermsContent = () => {
    if (selectedRole === 'agent') {
      return (
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base mb-2">Agent Terms & Conditions – Agentwaala</h3>
            <p className="text-muted-foreground mb-4">Last Updated: January 2026</p>
            <p className="mb-4">
              These Terms & Conditions govern the registration and use of the Agentwaala platform by agents. By creating an account or listing on Agentwaala, you agree to these Terms. If you do not agree, please do not use the platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">1. Agent Categories Covered</h4>
            <p>These Terms apply to all agents listed on Agentwaala, including:</p>
            <p className="ml-4 mt-1">Clothes Agents, Real Estate Agents, Fruit Agents, Crop Seeds Agents, Shoes Agents, Beauty Product Agents, Crops Agents, Tiles Agents, Second-hand Vehicle Agents (Brokers), Tours & Travel Agents, Flower Agents, Tobacco Agents, Medicine Agents (MRs).</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Age Eligibility (Mandatory)</h4>
            <p>All agents and customers must be 18 years or older. Agentwaala reserves the right to suspend or terminate accounts if incorrect age information is provided.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Nature of Platform</h4>
            <p>Agentwaala is an online listing and discovery platform and does not sell products or services. All transactions are independent.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Agent Role & Responsibility</h4>
            <p>Agents act as intermediaries and confirm that all information provided is accurate and lawful.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">5. Profile & Listing Rules</h4>
            <p>Agents must provide correct personal and business information and must not create fake or misleading profiles.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">6. Category-Specific Responsibilities</h4>
            <p>Medicine and Tobacco agents are strictly B2B. No consumer sales or promotions are allowed.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">7. Subscription & Fees</h4>
            <p>After one year, monthly subscription charges may apply. Details will be communicated in advance. Fees are non-refundable unless stated otherwise.</p>
          </div>

          {/* <div>
            <h4 className="font-semibold mb-2">8. Calls & Customer Contact</h4>
            <p>Customers may be charged for contacting agents. Agentwaala does not guarantee leads.</p>
          </div> */}

          <div>
            <h4 className="font-semibold mb-2">8. Availability Status</h4>
            <p>Agents may mark themselves online or offline.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">9. Reviews & Conduct</h4>
            <p>Agents cannot review other agents. Abuse and misuse are prohibited.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">10. Prohibited Activities</h4>
            <p>Illegal activities, misuse of data, and system bypassing are prohibited.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">11. Suspension & Termination</h4>
            <p>Agentwaala may suspend or terminate accounts without notice.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">12. Limitation of Liability</h4>
            <p>Agentwaala is not liable for losses or disputes.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">13. Changes to Terms</h4>
            <p>Terms may be updated at any time.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">14. Governing Law</h4>
            <p>Governed by the laws of India.</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-base mb-2">Customer Terms & Conditions – Agentwaala</h3>
            <p className="text-muted-foreground mb-4">Last Updated: January 2026</p>
            <p className="mb-4">
              These Terms & Conditions govern the use of the Agentwaala platform by customers. By accessing or using Agentwaala, you agree to these Terms. If you do not agree, please do not use the platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">1. Eligibility (Age Requirement)</h4>
            <p>Customers must be 18 years or older to use Agentwaala. Agentwaala reserves the right to suspend access if false age information is provided.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Nature of Platform</h4>
            <p>Agentwaala is an online agent discovery and listing platform. We do not sell products or services and do not act as a broker or guarantor. All transactions are independent.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Agent Categories Available</h4>
            <p>Clothes Agents, Real Estate Agents, Fruit Agents, Crop Seeds Agents, Shoes Agents, Beauty Product Agents, Crops Agents, Tiles Agents, Second-hand Vehicle Agents (Brokers), Tours & Travel Agents, Flower Agents, Tobacco Agents (B2B only), Medicine Agents (MRs – B2B only).</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Customer Responsibility</h4>
            <p>Customers must use the platform lawfully and verify agent credentials independently. Agentwaala is not responsible for transaction outcomes.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">5. Restricted Categories</h4>
            <p><strong>Tobacco Agents:</strong> B2B only, no consumer sales or promotion.</p>
            <p><strong>Medicine Agents (MRs):</strong> B2B only, no medical advice or patient sales.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">6. Reviews & Feedback</h4>
            <p>Reviews must be genuine and must not contain phone numbers, prices, promotional content, or abusive language.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">7. Availability Status</h4>
            <p>Agent availability is indicative only and does not guarantee service or response.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">8. Prohibited Activities</h4>
            <p>Harassment, data misuse, system bypassing, or illegal activities are prohibited.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">9. Limitation of Liability</h4>
            <p>Agentwaala is not liable for losses, disputes, fraud, or service quality issues. Use of the platform is at your own risk.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">10. Account Suspension & Termination</h4>
            <p>Agentwaala may suspend or terminate access without prior notice for violations.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">11. Changes to Terms</h4>
            <p>Terms may be updated at any time. Continued use indicates acceptance.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">12. Governing Law</h4>
            <p>These Terms are governed by the laws of India. All disputes are subject to Indian jurisdiction.</p>
          </div>
        </div>
      );
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
            <p className="text-muted-foreground">
              How would you like to use Agentwaala?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Card */}
            <Card 
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedRole === 'customer' ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => {
                setSelectedRole('customer');
                setTermsAccepted(false);
              }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  selectedRole === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  Customer
                  {selectedRole === 'customer' && <CheckCircle className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>
                  Find and connect with verified agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Browse verified agents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Direct calling & scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Save favorite agents
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Rate your experience
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Agent Card */}
            <Card 
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                selectedRole === 'agent' ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
              onClick={() => {
                setSelectedRole('agent');
                setTermsAccepted(false);
              }}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  selectedRole === 'agent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <Briefcase className="h-8 w-8" />
                </div>
                <CardTitle className="flex items-center justify-center gap-2">
                  Agent
                  {selectedRole === 'agent' && <CheckCircle className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>
                  Offer your expertise to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Create your agent profile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Manage availability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Receive customer leads
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Get verified badge
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Terms and Conditions Section */}
          {selectedRole && (
            <Card className="mt-6 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTermsDialog(true);
                        }}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Terms & Conditions
                        <FileText className="h-3 w-3" />
                      </button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      You must be 18 years or older to use Agentwaala
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button 
              onClick={handleRoleSelection}
              disabled={!selectedRole || !termsAccepted || isSubmitting}
              size="lg"
              className="min-w-[200px]"
            >
              {isSubmitting ? 'Setting up...' : 'Continue'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Free for now • No payment required
            </p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedRole === 'agent' ? 'Agent' : 'Customer'} Terms & Conditions
            </DialogTitle>
            <DialogDescription>
              Please read and understand these terms before continuing
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {getTermsContent()}
          </ScrollArea>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowTermsDialog(false)}>
              Close
            </Button>
            <Button 
              onClick={() => {
                setTermsAccepted(true);
                setShowTermsDialog(false);
              }}
            >
              I Agree
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectRole;