import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Video,
  Mic,
  Image as ImageIcon,
  PlusCircle,
  Settings,
  Award,
  Star,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Activity,
  Target,
  Sparkles,
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle,
  Edit3,
  Briefcase,
  Globe,
  Shield,
  PlayCircle
} from 'lucide-react';

interface CreatorStats {
  totalFollowers: number;
  monthlyViews: number;
  engagementRate: number;
  earnings: number;
  activeSessions: number;
  contentPieces: number;
  impactScore: number;
  completionRate: number;
}

interface LooproomSession {
  id: string;
  title: string;
  type: 'live' | 'scheduled' | 'recorded';
  participants: number;
  startTime: string;
  duration: string;
  category: string;
  earnings?: number;
  status?: 'upcoming' | 'live' | 'completed';
}

interface ContentAnalytics {
  contentId: string;
  title: string;
  type: 'video' | 'article' | 'audio' | 'live';
  views: number;
  engagement: number;
  shares: number;
  earnings: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

const CreatorDashboard: React.FC = () => {
  const [stats, setStats] = useState<CreatorStats>({
    totalFollowers: 1234,
    monthlyViews: 45678,
    engagementRate: 8.7,
    earnings: 3456.78,
    activeSessions: 12,
    contentPieces: 47,
    impactScore: 92,
    completionRate: 87
  });

  const [upcomingSessions] = useState<LooproomSession[]>([
    {
      id: '1',
      title: 'Morning Mindfulness & Breathwork',
      type: 'scheduled',
      participants: 0,
      startTime: 'Today, 9:00 AM',
      duration: '45 min',
      category: 'Meditation',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Recovery Support Circle',
      type: 'scheduled',
      participants: 0,
      startTime: 'Today, 2:00 PM',
      duration: '60 min',
      category: 'Recovery',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Evening Sound Healing',
      type: 'scheduled',
      participants: 0,
      startTime: 'Today, 7:00 PM',
      duration: '30 min',
      category: 'Wellness',
      status: 'upcoming'
    }
  ]);

  const [contentAnalytics] = useState<ContentAnalytics[]>([
    {
      contentId: '1',
      title: 'Guided Meditation for Anxiety',
      type: 'video',
      views: 12340,
      engagement: 89,
      shares: 234,
      earnings: 456.78,
      trend: 'up',
      trendPercent: 23
    },
    {
      contentId: '2',
      title: 'Breathwork Basics Course',
      type: 'article',
      views: 8765,
      engagement: 76,
      shares: 156,
      earnings: 234.56,
      trend: 'up',
      trendPercent: 15
    },
    {
      contentId: '3',
      title: 'Recovery Journey Podcast',
      type: 'audio',
      views: 6543,
      engagement: 92,
      shares: 189,
      earnings: 345.67,
      trend: 'stable',
      trendPercent: 0
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Creator Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1 bg-green-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                Creator Studio
                <Badge variant="outline" className="ml-2">
                  <Trophy className="w-3 h-3 mr-1" />
                  Top Creator
                </Badge>
              </h2>
              <p className="text-muted-foreground">Welcome back, Salah! Your impact is growing.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Content
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/30 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{stats.totalFollowers.toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronUp className="w-3 h-3" />
                  +12% this week
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Views</p>
                <p className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronUp className="w-3 h-3" />
                  +23% growth
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">{stats.engagementRate}%</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronUp className="w-3 h-3" />
                  Above average
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="text-2xl font-bold">${stats.earnings.toLocaleString()}</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ChevronUp className="w-3 h-3" />
                  +34% increase
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-muted-foreground">{session.startTime} • {session.duration}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    Go Live Now
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Write Article
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mic className="w-4 h-4 mr-2" />
                    Record Audio
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Session
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Host Workshop
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Performing Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentAnalytics.map(content => (
                  <div key={content.contentId} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        {content.type === 'video' && <Video className="w-6 h-6 text-primary" />}
                        {content.type === 'article' && <BookOpen className="w-6 h-6 text-primary" />}
                        {content.type === 'audio' && <Mic className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {content.views.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {content.engagement}%
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {content.shares}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${content.earnings.toFixed(2)}</p>
                      <p className={`text-sm flex items-center gap-1 ${
                        content.trend === 'up' ? 'text-green-500' :
                        content.trend === 'down' ? 'text-red-500' :
                        'text-muted-foreground'
                      }`}>
                        {content.trend === 'up' && <ChevronUp className="w-3 h-3" />}
                        {content.trend === 'down' && <ChevronDown className="w-3 h-3" />}
                        {content.trendPercent > 0 ? '+' : ''}{content.trendPercent}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creator Tips */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Creator Tip of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <strong>Boost Engagement:</strong> Try hosting interactive Q&A sessions after your looprooms.
                Creators who engage with their community see 3x higher retention rates and 45% more earnings.
                Schedule your first Q&A session today!
              </p>
              <Button className="mt-4" size="sm">
                Learn More Tips
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Session management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Content management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Community features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;