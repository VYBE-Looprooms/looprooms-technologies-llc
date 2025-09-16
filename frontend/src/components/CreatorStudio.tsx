import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { looproomApi, sessionApi, type Looproom, type LiveSession } from '@/services/api';
import CreateLooproom from './CreateLooproom';
import {
  Plus,
  Calendar,
  Users,
  TrendingUp,
  PlayCircle,
  Video,
  Mic,
  FileText,
  Settings,
  BarChart3,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';

interface CreatorStudioProps {
  userType: string;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ userType }) => {
  const [looprooms, setLooprooms] = useState<Looproom[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateLooproom, setShowCreateLooproom] = useState(false);

  const [creatorStats, setCreatorStats] = useState({
    totalFollowers: 0,
    monthlyViews: 0,
    activeLooprooms: 0,
    completedSessions: 0,
    averageRating: 0,
    upcomingSessions: 0
  });

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user's looprooms
        const looproomResponse = await looproomApi.getAll({
          sortBy: 'createdAt',
          sortOrder: 'desc',
          limit: 10
        });

        if (looproomResponse.success && looproomResponse.data) {
          setLooprooms(looproomResponse.data);

          // Calculate stats from real data
          const activeLooprooms = looproomResponse.data.filter(l => l.status === 'PUBLISHED').length;
          const totalViews = looproomResponse.data.reduce((sum, l) => sum + l.viewCount, 0);
          const avgRating = looproomResponse.data.length > 0
            ? looproomResponse.data.reduce((sum, l) => sum + (l.averageRating || 0), 0) / looproomResponse.data.length
            : 0;

          setCreatorStats(prev => ({
            ...prev,
            activeLooprooms,
            monthlyViews: totalViews,
            averageRating: Number(avgRating.toFixed(1))
          }));
        }

      } catch (err) {
        console.error('Error loading creator data:', err);
        setError('Failed to load creator data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, []);

  const quickActions = [
    {
      icon: Video,
      title: 'Go Live',
      description: 'Start an instant live session',
      color: 'from-red-500 to-pink-500',
      action: 'live',
      onClick: () => console.log('Go Live clicked')
    },
    {
      icon: Calendar,
      title: 'Schedule Session',
      description: 'Plan a future workshop',
      color: 'from-blue-500 to-purple-500',
      action: 'schedule',
      onClick: () => console.log('Schedule Session clicked')
    },
    {
      icon: Plus,
      title: 'Create Looproom',
      description: 'New healing space',
      color: 'from-green-500 to-emerald-500',
      action: 'looproom',
      onClick: () => setShowCreateLooproom(true)
    },
    {
      icon: FileText,
      title: 'Build Journey',
      description: 'Design a Loopchain path',
      color: 'from-orange-500 to-yellow-500',
      action: 'journey',
      onClick: () => console.log('Build Journey clicked')
    }
  ];

  const handleLooproomCreated = (newLooproom: any) => {
    setLooprooms(prev => [newLooproom, ...prev]);
    setCreatorStats(prev => ({
      ...prev,
      activeLooprooms: prev.activeLooprooms + 1
    }));
    setShowCreateLooproom(false);
  };

  // Generate recent content from real data
  const recentContent = looprooms.slice(0, 3).map(looproom => ({
    title: looproom.title,
    type: 'Looproom',
    date: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((Date.now() - new Date(looproom.createdAt).getTime()) / (1000 * 60 * 60 * 24)) * -1,
      'day'
    ),
    views: looproom.viewCount,
    reactions: looproom.reactionCount,
    status: looproom.status.toLowerCase()
  }));

  // Generate upcoming sessions from real data
  const upcomingSessions = sessions
    .filter(session =>
      session.status === 'SCHEDULED' &&
      new Date(session.scheduledStartTime) > new Date()
    )
    .slice(0, 3)
    .map(session => ({
      title: session.title || session.looproom.title,
      time: new Date(session.scheduledStartTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      date: new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }).format(new Date(session.scheduledStartTime)),
      registrations: session.currentParticipants,
      maxCapacity: session.maxParticipants
    }));

  if (userType !== 'creator') {
    return (
      <div className="space-y-6">
        <Card className="text-center py-16 bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl shadow-xl">
          <CardContent>
            <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Heart className="w-12 h-12 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Become a VYBE Creator</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Share your healing journey and help others transform their lives. Create Looprooms, host live sessions, and build meaningful connections.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Lead Sessions</p>
                <p className="text-xs text-muted-foreground">Guide healing journeys</p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Build Community</p>
                <p className="text-xs text-muted-foreground">Connect with members</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Create Impact</p>
                <p className="text-xs text-muted-foreground">Transform lives</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 text-primary-foreground">
              Apply to be Creator
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/80">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-muted rounded mx-auto mb-2"></div>
                  <div className="h-6 bg-muted rounded mb-1"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/80">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-16 bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardContent>
            <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Unable to Load Creator Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Creator Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{creatorStats.totalFollowers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary">{(creatorStats.monthlyViews / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground">Monthly Views</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="text-center">
              <PlayCircle className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{creatorStats.activeLooprooms}</p>
              <p className="text-xs text-muted-foreground">Active Looprooms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{creatorStats.averageRating}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/50 border-border/30 group"
                onClick={action.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-foreground flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-primary-foreground" />
              </div>
              Upcoming Sessions
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              Manage All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingSessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{session.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {session.date} at {session.time} • {session.registrations}/{session.maxCapacity} registered
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="rounded-lg">
                  Edit
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg">
                  Start
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Content Performance */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            Recent Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentContent.map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{content.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {content.type} • {content.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {content.views}
                </span>
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {content.reactions}
                </span>
                <Badge
                  className={`
                    ${content.status === 'completed' ? 'bg-green-500/20 text-green-600 border-green-500/30' : ''}
                    ${content.status === 'active' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' : ''}
                    ${content.status === 'published' ? 'bg-primary/20 text-primary border-primary/30' : ''}
                  `}
                >
                  {content.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Create Looproom Modal */}
      {showCreateLooproom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateLooproom
              onClose={() => setShowCreateLooproom(false)}
              onSuccess={handleLooproomCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorStudio;