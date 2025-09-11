import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, CheckCircle, ArrowRight, Mail, Shield, Users, Zap } from 'lucide-react';
import OnboardingIdentityVerification from '@/components/OnboardingIdentityVerification';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [identityVerified, setIdentityVerified] = useState(false);

  const isCreatorApplication = user?.creatorApplication;
  const totalSteps = isCreatorApplication ? 5 : 4;

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const nextStep = () => {
    markStepComplete(currentStep);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipOnboarding = () => {
    navigate('/dashboard');
  };

  const finishOnboarding = () => {
    markStepComplete(currentStep);
    // TODO: Mark onboarding as complete in backend
    navigate('/dashboard');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const progress = (completedSteps.length / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-vybe-primary/10 via-background to-vybe-secondary/10 flex items-center justify-center p-4 relative">
      {/* Theme Switcher */}
      <ThemeSwitcher className="fixed top-4 right-4 z-50" />
      
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-vybe-primary to-vybe-secondary bg-clip-text text-transparent">
              VYBE LOOPROOMS™
            </div>
            {isCreatorApplication && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Creator
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Your Wellness Journey, {user.profile?.firstName || 'there'}!
          </h1>
          <p className="text-lg text-foreground/70">
            Let's get you started with VYBE LOOPROOMS™ in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-foreground/60 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Created Successfully!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your VYBE LOOPROOMS™ account is now active. You have access to all three core Looprooms and a 14-day free trial.
                </p>
                {isCreatorApplication && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                      <Heart className="w-5 h-5" />
                      Creator Application Submitted
                    </div>
                    <p className="text-red-700 text-sm">
                      Your creator application is under review. You'll receive an email with identity verification steps within 24 hours.
                    </p>
                  </div>
                )}
                <Button onClick={nextStep} size="lg" className="w-full sm:w-auto">
                  Continue Setup <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                <p className="text-lg text-gray-600 mb-6">
                  We've sent a welcome email to <strong>{user.email}</strong> with important information about your account and next steps.
                </p>
                {isCreatorApplication && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-amber-800 text-sm">
                      <strong>Creator Next Steps:</strong> Look for a separate email with identity verification instructions and timeline for your creator application review.
                    </p>
                  </div>
                )}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={nextStep}>
                    Email Received <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore Your Looprooms</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    You now have access to our three core wellness environments:
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800 mb-2">Recovery Looproom</h3>
                    <p className="text-green-700 text-sm">Healing spaces for emotional recovery and personal growth</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800 mb-2">Fitness Looproom</h3>
                    <p className="text-blue-700 text-sm">Energizing workouts and movement therapy</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-indigo-800 mb-2">Meditation Looproom</h3>
                    <p className="text-indigo-700 text-sm">Mindful journeys and breathing exercises</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button onClick={nextStep}>
                    Ready to Explore <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && !isCreatorApplication && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your VYBE LOOPROOMS™ journey begins now. Connect with our community and start transforming your wellness experience.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-4">What's Next?</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Explore the three core Looprooms</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Connect with like-minded individuals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Start your first Loopchain journey</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Enjoy your 14-day free trial</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                  <Button onClick={finishOnboarding} size="lg">
                    Start My Journey <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && isCreatorApplication && (
              <div>
                <OnboardingIdentityVerification
                  onComplete={() => {
                    setIdentityVerified(true);
                    nextStep();
                  }}
                />
              </div>
            )}

            {currentStep === 5 && isCreatorApplication && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You're All Set!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your VYBE LOOPROOMS™ journey begins now. Your creator application is being processed.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-4">What's Next?</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Explore the three core Looprooms</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Connect with like-minded individuals</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Start your first Loopchain journey</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700">Enjoy your 14-day free trial</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                    <Shield className="w-5 h-5" />
                    Creator Application Status
                  </div>
                  <p className="text-red-700 text-sm">
                    {identityVerified 
                      ? "Identity verification completed! Your creator application will be reviewed within 2-3 business days."
                      : "Identity verification pending. Complete verification in your dashboard to proceed with creator application review."
                    }
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => setCurrentStep(isCreatorApplication ? 4 : 3)}>
                    Back
                  </Button>
                  <Button onClick={finishOnboarding} size="lg">
                    Enter Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skip Option */}
        <div className="text-center">
          <Button variant="ghost" onClick={skipOnboarding} className="text-gray-500 hover:text-gray-700">
            Skip onboarding for now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
