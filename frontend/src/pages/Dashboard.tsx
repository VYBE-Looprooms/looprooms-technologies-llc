import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Heart, 
  Settings, 
  Bell, 
  Activity, 
  Calendar, 
  Users, 
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
  Upload
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.creatorApplication && !user.identityVerified) {
      // If user has creator application but hasn't verified identity, redirect to verification
      navigate('/identity-verification');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const isCreatorApplication = user.creatorApplication;
  const creatorStatus = isCreatorApplication ? 'pending' : null; // In real app, this would come from backend

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-vybe-primary/5 relative">
      {/* Theme Switcher */}
      <ThemeSwitcher className="fixed top-4 right-4 z-50" />
      
      <Navbar />
      
      {/* Main Dashboard Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user.profile?.firstName || 'Creator'}!
                </h1>
                <p className="text-lg text-foreground/70">
                  Your VYBE LOOPROOMS™ dashboard
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isCreatorApplication && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Creator Application
                  </Badge>
                )}
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Creator Application Status */}
          {isCreatorApplication && (
            <Card className="mb-8 vybe-card border-vybe-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-vybe-accent" />
                  Creator Application Status
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your application for creator status is currently being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-vybe-accent flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">Your creator application has been received</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.identityVerified ? 'bg-vybe-accent' : 'bg-vybe-secondary'
                    }`}>
                      {user.identityVerified ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.identityVerified ? 'Identity Verified' : 'Identity Verification Required'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.identityVerified 
                          ? 'Your identity has been successfully verified'
                          : 'Please complete identity verification to proceed'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.identityVerified ? 'bg-vybe-accent' : 'bg-muted'
                    }`}>
                      {user.identityVerified ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Review & Approval
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.identityVerified 
                          ? 'Application ready for review'
                          : 'Pending identity verification completion'
                        }
                      </p>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-lg vybe-card border border-vybe-primary/20`}>
                    {!user.identityVerified ? (
                      <>
                        <h4 className="font-semibold text-foreground mb-2">Next Steps Required:</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-vybe-accent" />
                            <span>Upload front and back photos of your ID or passport</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-vybe-accent" />
                            <span>Complete face verification scan</span>
                          </div>
                        </div>
                        <Button 
                          className="mt-4 btn-glow" 
                          size="sm"
                          onClick={() => navigate('/identity-verification')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Start Identity Verification
                        </Button>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-foreground mb-2">Identity Verification Complete!</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-vybe-accent" />
                            <span>ID documents verified successfully</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-vybe-accent" />
                            <span>Face verification completed</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Your application is now under review. You'll be notified once approved.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Profile Card */}
            <Card className="vybe-card hover:shadow-lg transition-all hover:border-vybe-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="w-5 h-5 text-vybe-accent" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-foreground"><strong>Name:</strong> {user.profile?.firstName} {user.profile?.lastName}</p>
                  <p className="text-sm text-foreground"><strong>Email:</strong> {user.email}</p>
                  <p className="text-sm text-foreground"><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4 border-vybe-primary/30 hover:bg-vybe-primary/10">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="vybe-card hover:shadow-lg transition-all hover:border-vybe-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5 text-vybe-accent" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-vybe-accent">0</div>
                    <div className="text-sm text-muted-foreground">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-vybe-primary">3</div>
                    <div className="text-sm text-muted-foreground">Looprooms Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="vybe-card hover:shadow-lg transition-all hover:border-vybe-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Bell className="w-5 h-5 text-vybe-accent" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-foreground">
                    {isCreatorApplication ? 'Identity verification email sent' : 'Welcome to VYBE LOOPROOMS™!'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 border-vybe-primary/30 hover:bg-vybe-primary/10">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Looprooms Access */}
          <Card className="mb-8 vybe-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-vybe-accent" />
                Your Looprooms
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Explore your available wellness environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="vybe-card border border-vybe-primary/20 rounded-lg p-6 text-center hover:shadow-lg hover:border-vybe-accent/40 transition-all">
                  <div className="w-12 h-12 bg-vybe-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-vybe-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Recovery Looproom</h3>
                  <p className="text-muted-foreground text-sm mb-4">Healing spaces for emotional recovery and personal growth</p>
                  <Button size="sm" variant="outline" className="border-vybe-primary/30 text-foreground hover:bg-vybe-primary/10 hover:border-vybe-accent">
                    Enter Looproom
                  </Button>
                </div>
                
                <div className="vybe-card border border-vybe-primary/20 rounded-lg p-6 text-center hover:shadow-lg hover:border-vybe-accent/40 transition-all">
                  <div className="w-12 h-12 bg-vybe-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-vybe-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Fitness Looproom</h3>
                  <p className="text-muted-foreground text-sm mb-4">Energizing workouts and movement therapy</p>
                  <Button size="sm" variant="outline" className="border-vybe-primary/30 text-foreground hover:bg-vybe-primary/10 hover:border-vybe-accent">
                    Enter Looproom
                  </Button>
                </div>
                
                <div className="vybe-card border border-vybe-primary/20 rounded-lg p-6 text-center hover:shadow-lg hover:border-vybe-accent/40 transition-all">
                  <div className="w-12 h-12 bg-vybe-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-vybe-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Meditation Looproom</h3>
                  <p className="text-muted-foreground text-sm mb-4">Mindful journeys and breathing exercises</p>
                  <Button size="sm" variant="outline" className="border-vybe-primary/30 text-foreground hover:bg-vybe-primary/10 hover:border-vybe-accent">
                    Enter Looproom
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="vybe-card">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-vybe-primary/30 hover:bg-vybe-primary/10 hover:border-vybe-accent">
                  <Calendar className="w-6 h-6 text-vybe-accent" />
                  <span className="text-sm text-foreground">Schedule Session</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-vybe-primary/30 hover:bg-vybe-primary/10 hover:border-vybe-accent">
                  <Users className="w-6 h-6 text-vybe-accent" />
                  <span className="text-sm text-foreground">Find Community</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-vybe-primary/30 hover:bg-vybe-primary/10 hover:border-vybe-accent">
                  <FileText className="w-6 h-6 text-vybe-accent" />
                  <span className="text-sm text-foreground">View Progress</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 border-vybe-primary/30 hover:bg-vybe-primary/10 hover:border-vybe-accent">
                  <Settings className="w-6 h-6 text-vybe-accent" />
                  <span className="text-sm text-foreground">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
