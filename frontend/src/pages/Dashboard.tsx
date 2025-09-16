import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialFeed from '@/components/SocialFeed';
import CreatorDashboard from '@/components/CreatorDashboard';
import JourneyHub from '@/components/JourneyHub';
import CreatorStudio from '@/components/CreatorStudio';
import ExploreJourneys from '@/components/ExploreJourneys';
import MySpaces from '@/components/MySpaces';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {
  Heart,
  Brain,
  Dumbbell,
  Music,
  Palette,
  Bell,
  Settings,
  Search,
  Plus,
  Filter,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  MapPin,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Menu,
  X
} from 'lucide-react';

const THEME_COLORS = {
  recovery: {
    bg: 'bg-card/80',
    text: 'text-primary',
    icon: 'text-primary',
    border: 'border-primary/30',
    hover: 'hover:bg-card'
  },
  meditation: {
    bg: 'bg-card/80',
    text: 'text-secondary',
    icon: 'text-secondary',
    border: 'border-secondary/30',
    hover: 'hover:bg-card'
  },
  fitness: {
    bg: 'bg-card/80',
    text: 'text-accent',
    icon: 'text-accent',
    border: 'border-accent/30',
    hover: 'hover:bg-card'
  },
  music: {
    bg: 'bg-card/80',
    text: 'text-primary',
    icon: 'text-primary',
    border: 'border-primary/30',
    hover: 'hover:bg-card'
  },
  art: {
    bg: 'bg-card/80',
    text: 'text-secondary',
    icon: 'text-secondary',
    border: 'border-secondary/30',
    hover: 'hover:bg-card'
  }
};

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell,
  music: Music,
  art: Palette
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('journey');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [userType, setUserType] = useState<string>('member');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect admins to admin dashboard
    if (user.role === 'ADMIN' || user.role === 'MODERATOR') {
      navigate('/admin');
      return;
    }

    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('vybeOnboardingComplete');
    if (!onboardingComplete) {
      navigate('/onboarding');
      return;
    }

    // Load user preferences
    const themes = localStorage.getItem('vybeSelectedThemes');
    const type = localStorage.getItem('vybeUserType');

    // Check if user selected creator path but hasn't completed verification
    if (type === 'creator' && user.role !== 'CREATOR') {
      // Check if they have a pending application
      const checkVerificationStatus = async () => {
        try {
          const token = localStorage.getItem('vybe_token');
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://192.168.3.10:3443';
          const response = await fetch(`${backendUrl}/api/verification/creator/status`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (!data.data || data.data.status === 'NOT_FOUND') {
              // No application found, redirect to verification
              navigate('/creator-verification');
              return;
            } else if (data.data.status === 'PENDING' || data.data.status === 'UNDER_REVIEW') {
              // Application pending, show waiting message
              console.log('Creator application is pending admin review');
            } else if (data.data.status === 'REJECTED') {
              // Application rejected, can reapply
              navigate('/creator-verification');
              return;
            }
          }
        } catch (error) {
          console.error('Error checking verification status:', error);
        }
      };

      checkVerificationStatus();
    }

    if (themes) {
      setSelectedThemes(JSON.parse(themes));
    }
    if (type) {
      setUserType(type);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your VYBE experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/20 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-3 hover:bg-muted/50 rounded-xl"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search looprooms, creators, or topics..."
                  className="w-full pl-12 pr-4 py-3 bg-background/60 backdrop-blur-sm border border-border/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all duration-200 shadow-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search Button */}
              <Button variant="ghost" size="sm" className="md:hidden hover:bg-muted/50 rounded-xl">
                <Search className="w-5 h-5 text-muted-foreground" />
              </Button>

              <Button variant="ghost" size="sm" className="relative hover:bg-muted/50 rounded-xl">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full shadow-sm"></span>
              </Button>

              <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-muted/50 rounded-xl">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>

              <ThemeSwitcher />

              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 ring-2 ring-border/50">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold">
                    {user.profile?.firstName?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" onClick={handleLogout} className="hidden sm:flex text-sm hover:bg-muted/50 rounded-xl px-4">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border/20 z-50 lg:hidden transform transition-transform duration-300 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="hover:bg-muted/50 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile User Profile Card */}
          <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
            <div className="h-24 bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80"></div>
            <CardContent className="px-6 pb-6 -mt-10">
              <Avatar className="w-20 h-20 border-4 border-card mx-auto mb-4 shadow-lg">
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xl font-bold">
                  {user.profile?.firstName?.charAt(0) || user.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-bold text-foreground text-lg">
                  {user.profile?.firstName || 'VYBE Member'} {user.profile?.lastName || ''}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                <Badge className={`mt-3 px-4 py-1 rounded-xl font-semibold ${userType === 'creator' ? 'bg-accent/20 text-accent-foreground border border-accent/30' : 'bg-primary/20 text-primary-foreground border border-primary/30'}`}>
                  {userType === 'creator' ? '✨ Creator' : '🌱 Member'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Navigation Menu */}
          <div className="space-y-3">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start rounded-xl border-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start rounded-xl border-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200">
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-[88px] lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* User Profile Card */}
            <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <div className="h-24 bg-gradient-to-r from-primary/80 via-secondary/80 to-accent/80"></div>
              <CardContent className="px-6 pb-6 -mt-10">
                <Avatar className="w-20 h-20 border-4 border-card mx-auto mb-4 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xl font-bold">
                    {user.profile?.firstName?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-bold text-foreground text-lg">
                    {user.profile?.firstName || 'VYBE Member'} {user.profile?.lastName || ''}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <Badge className={`mt-3 px-4 py-1 rounded-xl font-semibold ${userType === 'creator' ? 'bg-accent/20 text-accent-foreground border border-accent/30' : 'bg-primary/20 text-primary-foreground border border-primary/30'}`}>
                    {userType === 'creator' ? '✨ Creator' : '🌱 Member'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Your Themes */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Your Themes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedThemes.map(themeId => {
                  const colors = THEME_COLORS[themeId as keyof typeof THEME_COLORS];
                  const IconComponent = THEME_ICONS[themeId as keyof typeof THEME_ICONS];

                  return (
                    <div key={themeId} className={`p-4 rounded-xl ${colors.bg} ${colors.border} border backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center">
                          <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                        </div>
                        <div>
                          <p className={`font-semibold ${colors.text} capitalize`}>{themeId}</p>
                          <p className="text-xs text-muted-foreground">3 active looprooms</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl border-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Theme
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Journey Progress */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground flex items-center">
                  Your Journey
                  <Badge className="ml-2 bg-primary/20 text-primary border border-primary/30 text-xs">
                    5-day streak
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sessions Progress */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/80 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Sessions</span>
                        <p className="text-xs text-muted-foreground">8 away from Growth Badge</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary text-lg">12/20</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>

                {/* Streak Progress */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Streak</span>
                        <p className="text-xs text-muted-foreground">2 days to weekly milestone</p>
                      </div>
                    </div>
                    <span className="font-bold text-secondary text-lg">5 days</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full flex-1 ${
                          i < 5 ? 'bg-gradient-to-r from-secondary to-accent' : 'bg-muted/30'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Impact Progress */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/80 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Impact</span>
                        <p className="text-xs text-muted-foreground">66 to Inspiration Badge</p>
                      </div>
                    </div>
                    <span className="font-bold text-accent text-lg">234</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-accent to-primary h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>

                {/* Next Milestone */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-border/30 text-center">
                  <Star className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xs font-medium text-foreground">Next: Growth Badge</p>
                  <p className="text-xs text-muted-foreground">Complete 8 more sessions</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Full width on mobile, 6 cols on desktop */}
          <div className="lg:col-span-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                <TabsList className="grid grid-cols-4 w-full sm:w-auto sm:max-w-md bg-card/80 backdrop-blur-sm border-border/20 rounded-xl p-1">
                  <TabsTrigger value="journey" className="rounded-lg font-medium text-xs sm:text-sm">Journey</TabsTrigger>
                  <TabsTrigger value="looprooms" className="rounded-lg font-medium text-xs sm:text-sm">My Spaces</TabsTrigger>
                  <TabsTrigger value="discover" className="rounded-lg font-medium text-xs sm:text-sm">Explore</TabsTrigger>
                  <TabsTrigger value="create" className="rounded-lg font-medium text-xs sm:text-sm">Create</TabsTrigger>
                </TabsList>

                <div className="flex space-x-2 sm:space-x-3">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none rounded-xl border-2 hover:bg-muted/50 backdrop-blur-sm">
                    <Filter className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                  <Button size="sm" className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-primary-foreground">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Join Live</span>
                  </Button>
                </div>
              </div>

              <TabsContent value="journey" className="mt-0">
                <JourneyHub userType={userType} />
              </TabsContent>

              <TabsContent value="looprooms" className="mt-0">
                <MySpaces selectedThemes={selectedThemes} />
              </TabsContent>

              <TabsContent value="discover" className="mt-0">
                <ExploreJourneys />
              </TabsContent>

              <TabsContent value="create" className="mt-0">
                <CreatorStudio userType={userType} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Trending Now */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center text-foreground">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-primary-foreground" />
                  </div>
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: '#MorningMeditation', posts: '2.3k posts', creator: { name: 'Sarah', avatar: 'S' } },
                  { tag: '#RecoveryJourney', posts: '1.8k posts', creator: { name: 'Marcus', avatar: 'M' } },
                  { tag: '#FitnessGoals', posts: '1.2k posts', creator: { name: 'Emma', avatar: 'E' } },
                  { tag: '#ArtTherapy', posts: '956 posts', creator: { name: 'Alex', avatar: 'A' } }
                ].map((trend, index) => {
                  const gradients = ['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-primary', 'from-primary to-accent'];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={trend.tag} className="flex justify-between items-center hover:bg-muted/50 p-3 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`bg-gradient-to-r ${gradient} text-primary-foreground text-xs font-semibold`}>
                            {trend.creator.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-foreground flex items-center">
                            {trend.tag}
                            <span className="text-xs text-muted-foreground ml-2">by {trend.creator.name}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{trend.posts}</p>
                        </div>
                      </div>
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center text-foreground">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-primary-foreground" />
                  </div>
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Morning Breathwork', time: '9:00 AM', theme: 'recovery', creator: { name: 'Dr. Sarah', avatar: '🧘‍♀️' } },
                  { name: 'Mindful Movement', time: '2:00 PM', theme: 'fitness', creator: { name: 'Coach Emma', avatar: '💪' } },
                  { name: 'Sound Healing', time: '7:00 PM', theme: 'meditation', creator: { name: 'Master Alex', avatar: '🎵' } }
                ].map((session, index) => {
                  const colors = THEME_COLORS[session.theme as keyof typeof THEME_COLORS] || THEME_COLORS.recovery;
                  const IconComponent = THEME_ICONS[session.theme as keyof typeof THEME_ICONS] || Heart;
                  const gradients = ['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-primary'];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200 backdrop-blur-sm">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-card/50 border border-border/30 flex items-center justify-center shadow-sm`}>
                          <IconComponent className={`w-5 h-5 text-primary`} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center text-xs shadow-sm`}>
                          {session.creator.avatar}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.time} • by {session.creator.name}</p>
                      </div>
                      <Button size="sm" variant="ghost" className={`text-primary hover:bg-muted/50 rounded-lg px-3`}>
                        Join
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center text-foreground">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  Connect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Sarah M.', role: 'Recovery Coach', mutual: '3 mutual' },
                  { name: 'Alex K.', role: 'Meditation Guide', mutual: '5 mutual' },
                  { name: 'Emma L.', role: 'Fitness Creator', mutual: '2 mutual' }
                ].map((person, index) => {
                  const gradients = ['from-primary to-secondary', 'from-secondary to-accent', 'from-accent to-primary'];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200">
                      <Avatar className="w-12 h-12 ring-2 ring-border/30">
                        <AvatarFallback className={`bg-gradient-to-r ${gradient} text-primary-foreground font-semibold`}>
                          {person.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.role} • {person.mutual}</p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-lg border-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200">
                        Follow
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/20 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-3 px-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 flex flex-col items-center py-3 space-y-1 rounded-none ${activeTab === 'journey' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('journey')}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Journey</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 flex flex-col items-center py-3 space-y-1 rounded-none ${activeTab === 'looprooms' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('looprooms')}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">My Spaces</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 flex flex-col items-center py-3 space-y-1 rounded-none ${activeTab === 'discover' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('discover')}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Explore</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 flex flex-col items-center py-3 space-y-1 rounded-none ${activeTab === 'create' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Create</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 flex flex-col items-center py-3 space-y-1 rounded-none text-muted-foreground"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;