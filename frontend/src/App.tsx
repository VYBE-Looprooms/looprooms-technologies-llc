import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Waitlist from "./pages/Waitlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if we should show waitlist mode
  const isWaitlistMode = import.meta.env.VITE_ENABLE_WAITLIST === 'true';
  const appMode = import.meta.env.VITE_APP_MODE;
  
  // In production, default to waitlist unless explicitly disabled
  const showWaitlist = appMode === 'waitlist' || isWaitlistMode;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {showWaitlist ? (
              // Waitlist mode - only show waitlist and essential pages
              <Routes>
                <Route path="/" element={<Waitlist />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<Waitlist />} />
              </Routes>
            ) : (
              // Full app mode - show all pages
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </LoadingScreen>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
