import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { userProgressApi, sessionApi, type LiveSession } from '@/services/api';
import {
  TrendingUp,
  Calendar,
  PlayCircle,
  Clock,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Lock,
  Users,
  Sparkles,
  Heart,
  Brain,
  Dumbbell,
  AlertCircle
} from 'lucide-react';

interface JourneyHubProps {
  userType: string;
}

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

const JourneyHub: React.FC<JourneyHubProps> = ({ userType }) => {
  const [activeJourneys, setActiveJourneys] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState({
    totalSessions: 0,
    streak: 0,
    totalTimeSpent: 0,
    completedJourneys: 0,
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJourneyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load user progress, active journeys, and upcoming sessions in parallel
        const [progressResponse, journeysResponse, sessionsResponse] = await Promise.all([
          userProgressApi.getProgress(),
          userProgressApi.getActiveJourneys(),
          sessionApi.getUpcoming(5)
        ]);

        if (progressResponse.success && progressResponse.data) {
          setUserProgress(progressResponse.data);
        }

        if (journeysResponse.success && journeysResponse.data) {
          setActiveJourneys(journeysResponse.data);
        }

        if (sessionsResponse.success && sessionsResponse.data) {
          // Transform sessions data to match component format
          const transformedSessions = sessionsResponse.data.map((session: LiveSession) => ({
            title: session.title || session.looproom.title,
            time: new Date(session.scheduledStartTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            }),
            theme: getThemeFromCategory(session.looproom.category.slug),
            creator: session.creator.profile?.displayName ||
                    `${session.creator.profile?.firstName || ''} ${session.creator.profile?.lastName || ''}`.trim() ||
                    'VYBE Creator',
            participants: session.currentParticipants,
            type: session.status === 'ACTIVE' ? 'live' : 'scheduled'
          }));
          setUpcomingSessions(transformedSessions);
        }

      } catch (err) {
        console.error('Error loading journey data:', err);
        setError('Failed to load journey data. Please try again.');

        // Fallback to mock data if API fails
        setActiveJourneys([
          {
            id: 'recovery-basics',
            title: 'Recovery Foundations',
            description: 'Essential healing practices for emotional recovery',
            theme: 'recovery',
            currentStep: 3,
            totalSteps: 7,
            progress: 43,
            nextSession: 'Morning Reflection',
            nextSessionTime: '9:00 AM',
            timeSpent: 145,
            daysActive: 5
          }
        ]);

        setUpcomingSessions([
          {
            title: 'Morning Recovery Circle',
            time: '9:00 AM',
            theme: 'recovery',
            creator: 'Dr. Sarah Chen',
            participants: 23,
            type: 'live'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, []);

  // Helper function to map category to theme
  const getThemeFromCategory = (categorySlug: string): 'recovery' | 'meditation' | 'fitness' => {
    if (categorySlug.includes('recovery') || categorySlug.includes('support')) return 'recovery';
    if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) return 'meditation';
    if (categorySlug.includes('fitness') || categorySlug.includes('movement')) return 'fitness';
    return 'recovery'; // default
  };

  const achievements = userProgress.achievements.slice(0, 3).map(achievement => ({
    icon: TrendingUp,
    title: achievement.title,
    description: achievement.description,
    color: 'text-primary'
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card/80">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </CardContent>
        </Card>
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
            <h3 className="text-xl font-semibold mb-2 text-foreground">Unable to Load Journey Data</h3>
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
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Active Streak</p>
                  <p className="text-2xl font-bold text-primary">{userProgress.streak} days</p>
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-primary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold text-secondary">{userProgress.totalSessions}</p>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-secondary opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Time Invested</p>
                  <p className="text-2xl font-bold text-accent">{(userProgress.totalTimeSpent / 60).toFixed(1)}h</p>
                </div>
              </div>
              <Award className="w-6 h-6 text-accent opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Journeys */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            Your Active Journeys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeJourneys.map((journey) => {
            const IconComponent = THEME_ICONS[journey.theme as keyof typeof THEME_ICONS];

            return (
              <Card key={journey.id} className="hover:shadow-lg transition-all duration-200 bg-card/50 border-border/30">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Journey Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{journey.title}</h3>
                          <p className="text-sm text-muted-foreground">{journey.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Step {journey.currentStep}/{journey.totalSteps}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{journey.progress}% complete</span>
                      </div>
                      <Progress value={journey.progress} className="h-2" />
                    </div>

                    {/* Journey Stats & Next Session */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {journey.timeSpent}min
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {journey.daysActive} days
                        </span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground">
                        <PlayCircle className="w-4 h-4 mr-1" />
                        Continue Journey
                      </Button>
                    </div>

                    {/* Next Session Preview */}
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm font-medium text-foreground">Next: {journey.nextSession}</p>
                      <p className="text-xs text-muted-foreground">Scheduled for {journey.nextSessionTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {activeJourneys.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Start Your First Journey</h3>
              <p className="text-muted-foreground mb-4">Begin with one of our foundational paths</p>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground">
                Explore Journeys
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-primary-foreground" />
            </div>
            Today's Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingSessions.map((session, index) => {
            const IconComponent = THEME_ICONS[session.theme as keyof typeof THEME_ICONS];
            const isLive = session.type === 'live';

            return (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200">
                <div className="relative">
                  <div className="w-12 h-12 bg-card/50 border border-border/30 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  {isLive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-foreground">{session.title}</h4>
                    {isLive && (
                      <Badge className="bg-red-500/20 text-red-600 border-red-500/30 text-xs">
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.time} • {session.creator} • {session.participants} joining
                  </p>
                </div>

                <Button
                  size="sm"
                  variant={isLive ? "default" : "outline"}
                  className={`rounded-lg ${isLive ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground' : ''}`}
                >
                  {isLive ? 'Join Live' : 'Schedule'}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-primary-foreground" />
            </div>
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/20">
              <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              <Sparkles className="w-5 h-5 text-primary opacity-60" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyHub;