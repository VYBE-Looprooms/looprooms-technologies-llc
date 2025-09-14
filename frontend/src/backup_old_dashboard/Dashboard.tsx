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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-vybe-primary/5 relative">
      <Navbar />

      {/* Main Dashboard Content - Modern Layout */}
      <div className="pt-20 pb-16">
        {/* Welcome Header - Mobile Responsive */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6 lg:mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Welcome back, {user.profile?.firstName || 'Friend'}! 👋
                </h1>
                <p className="text-base lg:text-lg text-foreground/70">
                  {isCreatorApplication ? 'Your Creator Hub - Transform Lives Today' : 'Your VYBE LOOPROOMS™ journey continues'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isCreatorApplication && (
                  <Badge variant="secondary" className="flex items-center gap-2 bg-vybe-secondary/20 text-vybe-secondary border-vybe-secondary/30">
                    <Heart className="w-3 h-3" />
                    Creator
                  </Badge>
                )}
                <Button variant="outline" onClick={handleLogout} className="hidden lg:flex">
                  Logout
                </Button>
              </div>
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

        {/* Modern Social Media Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Sidebar - Streamlined */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
              {/* Compact Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sessions</span>
                    <span className="text-lg font-bold text-orange-600">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Looprooms</span>
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                  {isCreatorApplication && user.identityVerified && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-lg font-bold text-green-600">0</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Enter Looproom
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Schedule
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Users className="w-4 h-4 text-blue-500" />
                    Community
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                    Settings
                  </button>
                </div>
              </div>

              {/* Profile Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.profile?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {user.profile?.firstName} {user.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Main Content - Social Feed */}
            <div className="lg:col-span-3 order-1">
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
