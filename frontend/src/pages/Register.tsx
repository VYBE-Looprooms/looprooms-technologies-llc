import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await register(form);

      if (!response.success || !response.data) {
        setError(response.message || "Unable to create your account. Please try again.");
        return;
      }

      toast({
        title: "Account created",
        description: "You're all set! Let's find the right looproom for your vibe.",
      });
      const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (authError) {
      console.error("[VYBE] Register error", authError);
      setError("Unexpected error while creating your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="section-padding pt-32 pb-20 section-bg-secondary">
          <div className="max-w-md mx-auto vybe-card border-glow">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gradient mb-3">Create your VYBE account</h1>
              <p className="text-foreground/70">
                Unlock the five signature Looproom themes and join positive-only journeys curated for your mood.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="Jordan"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Taylor"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    required
                  />
                </div>
              </div>

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
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                />
                <p className="text-xs text-foreground/50">
                  Use at least 8 characters, including one letter and one number.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 rounded-md px-3 py-2">{error}</p>
              )}

              <Button className="w-full btn-glow" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="text-sm text-foreground/60 text-center mt-6">
              Already part of the community? {" "}
              <Link to="/login" className="text-gradient font-medium">
                Sign in instead
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Register;

