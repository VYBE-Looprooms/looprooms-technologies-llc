import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { looproomApi, sessionApi, type Looproom, type LiveSession } from '@/services/api';
import {
  Heart,
  Brain,
  Dumbbell,
  Users,
  Clock,
  PlayCircle,
  Calendar,
  TrendingUp,
  Star,
  MessageCircle,
  Settings,
  Plus,
  Live,
  Radio,
  Volume2,
  AlertCircle
} from 'lucide-react';

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

const THEME_COLORS = {
  recovery: {
    bg: 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
    text: 'text-red-600',
    icon: 'text-red-600',
    border: 'border-red-500/30'
  },
  meditation: {
    bg: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
    text: 'text-blue-600',
    icon: 'text-blue-600',
    border: 'border-blue-500/30'
  },
  fitness: {
    bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
    text: 'text-green-600',
    icon: 'text-green-600',
    border: 'border-green-500/30'
  }
};

interface MySpacesProps {
  selectedThemes: string[];
}

const MySpaces: React.FC<MySpacesProps> = ({ selectedThemes }) => {
  const [looprooms, setLooprooms] = useState<Looproom[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMySpaces = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load user's looprooms and active sessions
        const [looproomResponse] = await Promise.all([
          looproomApi.getAll({
            limit: 20,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          })
        ]);

        if (looproomResponse.success && looproomResponse.data) {
          setLooprooms(looproomResponse.data);

          // For live sessions, we'd check each looproom for active sessions
          // This is a simplified version - in reality you'd have a dedicated endpoint
          const activeSessions: LiveSession[] = [];

          for (const looproom of looproomResponse.data.slice(0, 5)) {
            try {
              const sessionResponse = await sessionApi.getActiveForLooproom(looproom.id);
              if (sessionResponse.success && sessionResponse.data) {
                activeSessions.push(...sessionResponse.data);
              }
            } catch (err) {
              // Ignore individual session errors
              console.log(`No active sessions for ${looproom.title}`);
            }
          }

          setLiveSessions(activeSessions.filter(s => s.status === 'ACTIVE'));
        } else {
          setError('Failed to load your spaces');
        }

      } catch (err) {
        console.error('Error loading my spaces:', err);
        setError('Unable to load your spaces. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadMySpaces();
  }, []);

  // Generate theme mapping for compatibility
  const getThemeFromCategory = (categorySlug: string): 'recovery' | 'meditation' | 'fitness' => {
    if (categorySlug.includes('recovery') || categorySlug.includes('support')) return 'recovery';
    if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) return 'meditation';
    if (categorySlug.includes('fitness') || categorySlug.includes('movement')) return 'fitness';
    return 'recovery'; // default
  };

  // Convert API data to component format
  const myLooprooms = looprooms.map(looproom => ({
    id: looproom.id,
    title: looproom.title,
    theme: getThemeFromCategory(looproom.category.slug),
    description: looproom.description,
    isLive: liveSessions.some(session => session.looproomId === looproom.id),
    currentParticipants: looproom.viewCount || 0,
    maxParticipants: 100,
    nextSession: 'TBD',
    totalSessions: 1,
    myParticipation: 0,
    lastVisited: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.floor((Date.now() - new Date(looproom.createdAt).getTime()) / (1000 * 60 * 60 * 24)) * -1,
      'day'
    ),
    creator: looproom.creator.name,
    mood: 'inspiring'
  }));

  const liveNow = liveSessions.map(session => ({
    title: session.title || session.looproom.title,
    theme: getThemeFromCategory(session.looproom.category.slug),
    participants: session.currentParticipants,
    duration: session.duration ? `${session.duration} min` : 'Live now'
  }));

  const filteredLooprooms = selectedThemes.length > 0
    ? myLooprooms.filter(room => selectedThemes.includes(room.theme))
    : myLooprooms;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-card/80">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/4"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
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
            <h3 className="text-xl font-semibold mb-2 text-foreground">Unable to Load Your Spaces</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (looprooms.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="text-center py-16 bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
          <CardContent>
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Spaces Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your VYBE journey by exploring and joining Looprooms that resonate with you.
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Explore Journeys
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Sessions Banner */}
      {liveNow.length > 0 && (
        <Card className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border-red-500/20 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                <Radio className="w-4 h-4 text-white" />
              </div>
              Live Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveNow.map((session, index) => {
                const IconComponent = THEME_ICONS[session.theme as keyof typeof THEME_ICONS];

                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {session.participants} participants • {session.duration}
                      </p>
                    </div>
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Active Spaces */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-foreground flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              My Active Spaces
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-1" />
              Join New Space
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredLooprooms.map((looproom) => {
            const IconComponent = THEME_ICONS[looproom.theme as keyof typeof THEME_ICONS];
            const colors = THEME_COLORS[looproom.theme as keyof typeof THEME_COLORS];

            return (
              <Card key={looproom.id} className="hover:shadow-xl transition-all duration-300 bg-card/50 border-border/30 group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Looproom Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center border ${colors.border} group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-xl text-foreground">{looproom.title}</h3>
                            {looproom.isLive && (
                              <Badge className="bg-red-500/20 text-red-600 border-red-500/30 text-xs animate-pulse">
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{looproom.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Created by {looproom.creator} • Last visited {looproom.lastVisited}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{looproom.myParticipation}</p>
                        <p className="text-xs text-muted-foreground">My Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-secondary">{looproom.totalSessions}</p>
                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">{looproom.currentParticipants}</p>
                        <p className="text-xs text-muted-foreground">Online Now</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{Math.round((looproom.myParticipation / looproom.totalSessions) * 100)}%</p>
                        <p className="text-xs text-muted-foreground">Participation</p>
                      </div>
                    </div>

                    {/* Next Session & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Next: {looproom.nextSession}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {looproom.currentParticipants}/{looproom.maxParticipants} capacity
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {looproom.isLive ? (
                          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg">
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Join Live
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg text-primary-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              Schedule
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Ambient Sound Controls (if applicable) */}
                    {looproom.theme === 'meditation' && (
                      <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-foreground">Ambient Sounds</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="text-xs px-2">
                              Rain
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs px-2">
                              Ocean
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs px-2">
                              Forest
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredLooprooms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-2">No Active Spaces</h3>
              <p className="text-muted-foreground mb-4">
                {selectedThemes.length > 0
                  ? 'No Looprooms found for your selected themes'
                  : 'Join your first Looproom to start your healing journey'
                }
              </p>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Explore Looprooms
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Join Suggestions */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              title: 'New Member Welcome Circle',
              theme: 'recovery',
              description: 'Safe space for newcomers to share and connect',
              participants: 15,
              nextSession: 'Today 7:00 PM'
            },
            {
              title: 'Anxiety Relief Sessions',
              theme: 'meditation',
              description: 'Specialized practices for managing anxiety',
              participants: 28,
              nextSession: 'Tomorrow 10:00 AM'
            },
            {
              title: 'Gentle Movement Therapy',
              theme: 'fitness',
              description: 'Low-impact exercises for emotional healing',
              participants: 19,
              nextSession: 'Tomorrow 4:00 PM'
            }
          ].map((suggestion, index) => {
            const IconComponent = THEME_ICONS[suggestion.theme as keyof typeof THEME_ICONS];
            const colors = THEME_COLORS[suggestion.theme as keyof typeof THEME_COLORS];

            return (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center border ${colors.border}`}>
                    <IconComponent className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{suggestion.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.participants} members • {suggestion.nextSession}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200">
                  Join Space
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default MySpaces;