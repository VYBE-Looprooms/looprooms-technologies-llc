import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CreatorApplicationStatus from '@/components/CreatorApplicationStatus';
import SocialFeed from '@/components/SocialFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Heart, 
  Settings, 
  Bell, 
  Activity, 
  Calendar, 
  Users, 
  Zap,
  FileText,
  TrendingUp,
  UserPlus
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-vybe-primary/5 relative">
      <Navbar />
      
      {/* Main Dashboard Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user.profile?.firstName || 'Friend'}!
                </h1>
                <p className="text-lg text-foreground/70">
                  {isCreatorApplication ? 'Your Creator Hub' : 'Your VYBE LOOPROOMS™ community'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isCreatorApplication && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Creator
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
            <div className="mb-8">
              <CreatorApplicationStatus
                application={user.creatorApplication}
                identityVerified={user.identityVerified}
                onStartVerification={() => navigate('/identity-verification')}
              />
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Sidebar - Quick Stats & Actions */}
            <div className="xl:col-span-1 space-y-6 order-2 xl:order-1">
              {/* Quick Stats */}
              <Card className="vybe-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Activity className="w-5 h-5 text-vybe-accent" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-vybe-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-vybe-primary">0</div>
                    <div className="text-sm text-muted-foreground">Sessions This Week</div>
                  </div>
                  <div className="text-center p-4 bg-vybe-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-vybe-secondary">3</div>
                    <div className="text-sm text-muted-foreground">Looprooms Available</div>
                  </div>
                  {isCreatorApplication && user.identityVerified && (
                    <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-sm text-muted-foreground">Content Created</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="vybe-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Zap className="w-5 h-5 text-vybe-accent" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Enter Looproom
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Find Community
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Summary */}
              <Card className="vybe-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5 text-vybe-accent" />
                    Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Name:</span> {user.profile?.firstName} {user.profile?.lastName}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Member since:</span> {new Date().toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Social Feed */}
            <div className="xl:col-span-3 order-1 xl:order-2">
              <SocialFeed />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
