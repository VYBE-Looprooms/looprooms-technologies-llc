import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import IdentityVerificationPage from "./pages/IdentityVerificationPage";
import MobileVerificationPage from "./pages/MobileVerificationPage";
import QRTestPage from "./pages/QRTestPage";
import CreatorVerification from "./pages/CreatorVerification";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Looproom from "./pages/Looproom";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import StudioLive from "./pages/Studio/StudioLive";
import StudioSchedule from "./pages/Studio/StudioSchedule";
import CreatorApplication from "./pages/CreatorApplication";
import LoopchainViewer from "./pages/LoopchainViewer";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LoadingScreen>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/identity-verification" element={<IdentityVerificationPage />} />
                <Route path="/mobile-verification" element={<MobileVerificationPage />} />
                <Route path="/qr-test" element={<QRTestPage />} />
                <Route path="/creator-verification" element={<CreatorVerification />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/looproom/:id" element={<Looproom />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/studio/live" element={<StudioLive />} />
                <Route path="/studio/live/:sessionId" element={<StudioLive />} />
                <Route path="/studio/schedule" element={<StudioSchedule />} />
                <Route path="/creator-application" element={<CreatorApplication />} />
                <Route path="/loopchain/:id" element={<LoopchainViewer />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LoadingScreen>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
