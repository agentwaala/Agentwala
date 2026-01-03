import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Agents from "./pages/Agents";
import AgentProfile from "./pages/AgentProfile";
import AgentDashboard from "./pages/AgentDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Domains from "./pages/Domains";
import BecomeAgent from "./pages/BecomeAgent";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import SelectRole from "./pages/SelectRole";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import CompanyAbout from "./pages/CompanyAbout";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CeoAbout from "./pages/CeoAbout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id" element={<AgentProfile />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/become-agent" element={<BecomeAgent />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/Terms&Conditions" element={<TermsAndConditions />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/about" element={<CeoAbout />} />
            <Route path="/Companyabout" element={<CompanyAbout />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/select-role" element={<SelectRole />} />
            
            {/* Protected Routes */}
            <Route path="/agent-dashboard" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/customer-dashboard" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              // <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              // </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
