import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Users, Briefcase, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SelectRole = () => {
  const { user, role, setUserRole, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'agent' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user already has a role
  useEffect(() => {
    if (!loading && role) {
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'agent') {
        navigate('/agent-dashboard', { replace: true });
      } else {
        navigate('/customer-dashboard', { replace: true });
      }
    }
  }, [role, loading, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;
    
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

  if (loading) {
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

  // Show loading while redirecting existing users
  if (role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
              onClick={() => setSelectedRole('customer')}
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
              onClick={() => setSelectedRole('agent')}
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

          <div className="mt-8 text-center">
            <Button 
              onClick={handleRoleSelection}
              disabled={!selectedRole || isSubmitting}
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
    </div>
  );
};

export default SelectRole;
