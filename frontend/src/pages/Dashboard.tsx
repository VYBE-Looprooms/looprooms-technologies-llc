import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
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
            <Card className="mb-8 border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Shield className="w-5 h-5" />
                  Creator Application Status
                </CardTitle>
                <CardDescription className="text-red-700">
                  Your application for creator status is currently being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Application Submitted</p>
                      <p className="text-sm text-green-700">Your creator application has been received</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.identityVerified ? 'bg-green-500' : 'bg-amber-500'
                    }`}>
                      {user.identityVerified ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        user.identityVerified ? 'text-green-800' : 'text-amber-800'
                      }`}>
                        {user.identityVerified ? 'Identity Verified' : 'Identity Verification Required'}
                      </p>
                      <p className={`text-sm ${
                        user.identityVerified ? 'text-green-700' : 'text-amber-700'
                      }`}>
                        {user.identityVerified 
                          ? 'Your identity has been successfully verified'
                          : 'Please complete identity verification to proceed'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.identityVerified ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {user.identityVerified ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        user.identityVerified ? 'text-green-800' : 'text-gray-600'
                      }`}>
                        Review & Approval
                      </p>
                      <p className={`text-sm ${
                        user.identityVerified ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {user.identityVerified 
                          ? 'Application ready for review'
                          : 'Pending identity verification completion'
                        }
                      </p>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-lg ${
                    user.identityVerified ? 'bg-green-100' : 'bg-amber-100'
                  }`}>
                    {!user.identityVerified ? (
                      <>
                        <h4 className="font-semibold text-amber-800 mb-2">Next Steps Required:</h4>
                        <div className="space-y-2 text-sm text-amber-700">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            <span>Upload front and back photos of your ID or passport</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Complete face verification scan</span>
                          </div>
                        </div>
                        <Button 
                          className="mt-4 bg-amber-600 hover:bg-amber-700" 
                          size="sm"
                          onClick={() => navigate('/identity-verification')}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Start Identity Verification
                        </Button>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-green-800 mb-2">Identity Verification Complete!</h4>
                        <div className="space-y-2 text-sm text-green-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>ID documents verified successfully</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Face verification completed</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-green-700">
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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Name:</strong> {user.profile?.firstName} {user.profile?.lastName}</p>
                  <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                  <p className="text-sm"><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Looprooms Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    {isCreatorApplication ? 'Identity verification email sent' : 'Welcome to VYBE LOOPROOMS™!'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Looprooms Access */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Your Looprooms
              </CardTitle>
              <CardDescription>
                Explore your available wellness environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">Recovery Looproom</h3>
                  <p className="text-green-700 text-sm mb-4">Healing spaces for emotional recovery and personal growth</p>
                  <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                    Enter Looproom
                  </Button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-blue-800 mb-2">Fitness Looproom</h3>
                  <p className="text-blue-700 text-sm mb-4">Energizing workouts and movement therapy</p>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    Enter Looproom
                  </Button>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-indigo-800 mb-2">Meditation Looproom</h3>
                  <p className="text-indigo-700 text-sm mb-4">Mindful journeys and breathing exercises</p>
                  <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-100">
                    Enter Looproom
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Schedule Session</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Find Community</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">View Progress</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span className="text-sm">Settings</span>
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
