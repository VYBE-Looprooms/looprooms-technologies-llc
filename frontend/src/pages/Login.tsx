import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: "email" | "password") => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login(form);

      if (!response.success || !response.data) {
        setError(response.message || "Unable to log in. Please try again.");
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You're now signed in to VYBE LOOPROOMS.",
      });
      const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (authError) {
      console.error("[VYBE] Login error", authError);
      setError("Unexpected error while logging in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="section-padding pt-32 pb-20 section-bg-primary">
          <div className="max-w-md mx-auto vybe-card border-glow">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gradient mb-3">Welcome back</h1>
              <p className="text-foreground/70">
                Sign in to continue your VYBE journey across Recovery, Meditation, Fitness, Wellness, and Healthy Living looprooms.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 rounded-md px-3 py-2">{error}</p>
              )}

              <Button className="w-full btn-glow" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-sm text-foreground/60 text-center mt-6">
              New to VYBE LOOPROOMS? {" "}
              <Link to="/register" className="text-gradient font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;


