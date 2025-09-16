import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { looproomApi, sessionApi, wsManager, type Looproom as LooproomType, type LiveSession } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  Brain,
  Dumbbell,
  PlayCircle,
  PauseCircle,
  Users,
  MessageCircle,
  Share2,
  Bookmark,
  Settings,
  Clock,
  Calendar,
  Star,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ArrowLeft,
  Radio,
  Sparkles,
  ThumbsUp,
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react';

const THEME_CONFIGS = {
  recovery: {
    icon: Heart,
    name: 'Recovery',
    color: 'text-red-600',
    bg: 'from-red-500/10 to-pink-500/10',
    border: 'border-red-500/20',
    primaryColor: 'bg-red-500',
    description: 'Healing spaces for emotional recovery and personal growth'
  },
  meditation: {
    icon: Brain,
    name: 'Meditation',
    color: 'text-blue-600',
    bg: 'from-blue-500/10 to-purple-500/10',
    border: 'border-blue-500/20',
    primaryColor: 'bg-blue-500',
    description: 'Mindful journeys through guided meditation and breathing'
  },
  fitness: {
    icon: Dumbbell,
    name: 'Fitness',
    color: 'text-green-600',
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    primaryColor: 'bg-green-500',
    description: 'Energizing workouts and movement therapy for wellbeing'
  }
};

interface LooproomData {
  id: string;
  title: string;
  description: string;
  theme: 'recovery' | 'meditation' | 'fitness';
  creator: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  isLive: boolean;
  isJoined: boolean;
  currentParticipants: number;
  maxParticipants: number;
  duration: number; // in minutes
  startTime: string;
  contentUrl?: string;
  playlist?: Array<{
    id: string;
    title: string;
    artist: string;
    duration: number;
    url: string;
  }>;
  supportingContent?: string;
  guidelines?: string[];
}

const Looproom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [looproomData, setLooproomData] = useState<LooproomData | null>(null);
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('session');
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  // Helper function to map category to theme
  const getThemeFromCategory = (categorySlug: string): 'recovery' | 'meditation' | 'fitness' => {
    if (categorySlug.includes('recovery') || categorySlug.includes('support')) return 'recovery';
    if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) return 'meditation';
    if (categorySlug.includes('fitness') || categorySlug.includes('movement')) return 'fitness';
    return 'recovery';
  };

  // Load real API data
  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const loadLooproom = async () => {
      try {
        setLoading(true);
        setError(null);

        const [looproomResponse, activeSessionsResponse] = await Promise.all([
          looproomApi.getById(id),
          sessionApi.getActiveForLooproom(id)
        ]);

        if (looproomResponse.success && looproomResponse.data) {
          const apiLooproom = looproomResponse.data;

          // Transform API data to component format
          const transformedData: LooproomData = {
            id: apiLooproom.id,
            title: apiLooproom.title,
            description: apiLooproom.description,
            theme: getThemeFromCategory(apiLooproom.category.slug),
            creator: {
              name: apiLooproom.creator.name,
              avatar: apiLooproom.creator.name.split(' ').map(n => n[0]).join(''),
              isVerified: true // Mock for now
            },
            isLive: false, // Will be set based on active sessions
            isJoined: false,
            currentParticipants: 0,
            maxParticipants: 100,
            duration: apiLooproom.duration || 60,
            startTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            supportingContent: `Join ${apiLooproom.creator.name} for this ${apiLooproom.category.name.toLowerCase()} session.`,
            guidelines: [
              'Respect others\' sharing and maintain confidentiality',
              'Share only what feels comfortable for you',
              'Listen with compassion and without judgment',
              'Use "I" statements when sharing experiences',
              'Keep discussions focused and supportive'
            ],
            playlist: [
              {
                id: '1',
                title: 'Calming Sounds',
                artist: 'Nature\'s Voice',
                duration: 180,
                url: ''
              }
            ]
          };

          setLooproomData(transformedData);

          // Increment view count
          looproomApi.incrementViews(id);
        } else {
          setError('Looproom not found');
          return;
        }

        if (activeSessionsResponse.success && activeSessionsResponse.data && activeSessionsResponse.data.length > 0) {
          const activeSession = activeSessionsResponse.data[0];
          setLiveSession(activeSession);

          // Update looproom data with live session info
          setLooproomData(prev => prev ? {
            ...prev,
            isLive: true,
            currentParticipants: activeSession.currentParticipants,
            maxParticipants: activeSession.maxParticipants
          } : null);
        }

      } catch (err) {
        console.error('Error loading looproom:', err);
        setError('Failed to load looproom');

        // Fallback to mock data if API fails
        const mockData: LooproomData = {
          id: id || 'recovery-morning-circle',
          title: 'Morning Recovery Circle',
          description: 'Start your day with intention, gratitude, and community support. A safe space for sharing, reflection, and mutual encouragement in your recovery journey.',
          theme: 'recovery',
          creator: {
            name: 'Dr. Sarah Chen',
            avatar: 'SC',
            isVerified: true
          },
          isLive: true,
          isJoined: false,
          currentParticipants: 23,
          maxParticipants: 30,
          duration: 60,
          startTime: '9:00 AM',
          supportingContent: 'Today we\'ll focus on building daily habits that support long-term recovery. Bring your journal if you have one.',
          guidelines: [
            'Respect others\' sharing and maintain confidentiality',
            'Share only what feels comfortable for you',
            'Listen with compassion and without judgment',
            'Use "I" statements when sharing experiences',
            'Keep discussions recovery-focused and supportive'
          ],
          playlist: [
            {
              id: '1',
              title: 'Morning Serenity',
              artist: 'Healing Sounds',
              duration: 180,
              url: ''
            },
            {
              id: '2',
              title: 'Gentle Awakening',
              artist: 'Nature\'s Peace',
              duration: 240,
              url: ''
            }
          ]
        };
        setLooproomData(mockData);
        setError(null); // Clear error to show mock data
      } finally {
        setLoading(false);
      }
    };

    loadLooproom();

    // Set up WebSocket connection for live updates
    wsManager.connect();

    return () => {
      if (isJoined && liveSession) {
        wsManager.leaveSession(liveSession.id);
      }
    };
  }, [id, navigate]);

  const handleJoinLeave = async () => {
    if (!liveSession) {
      // Create and start a new live session
      try {
        const createResponse = await sessionApi.create({
          looproomId: looproomData!.id,
          title: `Live: ${looproomData!.title}`,
          scheduledStartTime: new Date().toISOString(),
          maxParticipants: 100,
          allowAnonymous: true,
          isRecorded: false
        });

        if (createResponse.success && createResponse.data) {
          const startResponse = await sessionApi.start(createResponse.data.id);
          if (startResponse.success) {
            setLiveSession(createResponse.data);
            setLooproomData(prev => prev ? { ...prev, isLive: true, currentParticipants: 1 } : null);
            setIsJoined(true);
            wsManager.joinSession(createResponse.data.id);
          }
        }
      } catch (err) {
        console.error('Error creating/starting session:', err);
        // Fallback: just toggle state for now
        setIsJoined(!isJoined);
        if (!isJoined) {
          setLooproomData(prev => prev ? { ...prev, isLive: true, currentParticipants: prev.currentParticipants + 1 } : null);
        }
      }
    } else {
      // Join or leave existing session
      if (isJoined) {
        try {
          const response = await sessionApi.leave(liveSession.id);
          if (response.success) {
            setIsJoined(false);
            wsManager.leaveSession(liveSession.id);
            setLooproomData(prev => prev ? {
              ...prev,
              currentParticipants: Math.max(0, prev.currentParticipants - 1)
            } : null);
          }
        } catch (err) {
          console.error('Error leaving session:', err);
          setIsJoined(false);
          setLooproomData(prev => prev ? {
            ...prev,
            currentParticipants: Math.max(0, prev.currentParticipants - 1)
          } : null);
        }
      } else {
        try {
          const response = await sessionApi.join(liveSession.id);
          if (response.success) {
            setIsJoined(true);
            wsManager.joinSession(liveSession.id);
            setLooproomData(prev => prev ? {
              ...prev,
              currentParticipants: prev.currentParticipants + 1
            } : null);
          }
        } catch (err) {
          console.error('Error joining session:', err);
          setIsJoined(true);
          setLooproomData(prev => prev ? {
            ...prev,
            currentParticipants: prev.currentParticipants + 1
          } : null);
        }
      }
    }
  };

  const handleSendComment = async () => {
    if (newComment.trim()) {
      const commentData = {
        id: Date.now().toString(),
        user: user?.username || 'Anonymous',
        message: newComment.trim(),
        timestamp: new Date().toISOString()
      };

      // Add comment locally first for immediate feedback
      setComments(prev => [...prev, commentData]);
      setNewComment('');

      // Try to send to server if live session exists
      if (liveSession) {
        try {
          const response = await sessionApi.addComment(liveSession.id, newComment.trim());
          if (response.success) {
            wsManager.sendComment(liveSession.id, newComment.trim());
          }
        } catch (err) {
          console.error('Error sending comment:', err);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Looproom...</p>
        </div>
      </div>
    );
  }

  if (error && !looproomData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="text-center py-16 bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl shadow-xl max-w-md">
          <CardContent>
            <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Looproom Not Found</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-primary to-secondary">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!looproomData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Looproom...</p>
        </div>
      </div>
    );
  }

  const themeConfig = THEME_CONFIGS[looproomData.theme];
  const IconComponent = themeConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/20 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-muted/50 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>

              <div className={`w-12 h-12 bg-gradient-to-r ${themeConfig.bg} rounded-xl flex items-center justify-center border ${themeConfig.border}`}>
                <IconComponent className={`w-6 h-6 ${themeConfig.color}`} />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-foreground">{looproomData.title}</h1>
                  {looproomData.isLive && (
                    <Badge className="bg-red-500/20 text-red-600 border-red-500/30 animate-pulse">
                      <Radio className="w-3 h-3 mr-1" />
                      LIVE
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Avatar className="w-4 h-4 mr-1">
                      <AvatarFallback className="text-xs">{looproomData.creator.avatar}</AvatarFallback>
                    </Avatar>
                    {looproomData.creator.name}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {looproomData.currentParticipants}/{looproomData.maxParticipants}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {looproomData.duration}min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Bookmark className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              {isJoined ? (
                <Button
                  onClick={handleJoinLeave}
                  variant="outline"
                  className="rounded-xl border-2 border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Leave Session
                </Button>
              ) : (
                <Button
                  onClick={handleJoinLeave}
                  className={`${themeConfig.primaryColor} hover:opacity-90 rounded-xl text-white shadow-lg`}
                >
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Join Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full bg-card/80 backdrop-blur-sm border-border/20 rounded-xl p-1 mb-6">
                <TabsTrigger value="session" className="rounded-lg font-medium">Session</TabsTrigger>
                <TabsTrigger value="community" className="rounded-lg font-medium">Community</TabsTrigger>
                <TabsTrigger value="resources" className="rounded-lg font-medium">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="session" className="mt-0">
                <div className="space-y-6">
                  {/* Main Session Area */}
                  <Card className={`bg-gradient-to-br ${themeConfig.bg} border ${themeConfig.border} shadow-xl rounded-2xl`}>
                    <CardContent className="p-8">
                      {isJoined ? (
                        <div className="space-y-6">
                          {/* Session Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                                <IconComponent className="w-8 h-8 text-primary-foreground" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-foreground">You're in the session</h2>
                                <p className="text-muted-foreground">Welcome to the healing circle</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsMuted(!isMuted)}
                                className="rounded-xl"
                              >
                                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                className="rounded-xl"
                              >
                                {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                                className="rounded-xl"
                              >
                                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>

                          {/* Participants Grid */}
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {Array.from({ length: Math.min(looproomData.currentParticipants, 12) }).map((_, index) => (
                              <div key={index} className="aspect-square bg-muted/30 rounded-xl flex items-center justify-center border border-border/30">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback>P{index + 1}</AvatarFallback>
                                </Avatar>
                              </div>
                            ))}
                          </div>

                          {/* Current Activity */}
                          <div className="p-6 bg-card/50 rounded-xl border border-border/30">
                            <h3 className="font-semibold text-foreground mb-2">Current Activity</h3>
                            <p className="text-muted-foreground mb-4">{looproomData.supportingContent}</p>
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              <span className="text-sm text-primary font-medium">Guided reflection in progress</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                            <IconComponent className="w-12 h-12 text-primary-foreground" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to join this healing circle?</h2>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">{looproomData.description}</p>
                          <div className="space-y-4">
                            <div className="p-4 bg-card/50 rounded-xl border border-border/30 max-w-md mx-auto">
                              <p className="text-sm text-foreground font-medium mb-2">What to expect:</p>
                              <p className="text-sm text-muted-foreground">{looproomData.supportingContent}</p>
                            </div>
                            <Button
                              onClick={handleJoinLeave}
                              className={`${themeConfig.primaryColor} hover:opacity-90 rounded-xl text-white shadow-lg px-8 py-3 text-lg`}
                            >
                              <PlayCircle className="w-5 h-5 mr-2" />
                              Join Session Now
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Session Guidelines */}
                  {!isJoined && (
                    <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-foreground">Session Guidelines</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {looproomData.guidelines?.map((guideline, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-xs font-semibold text-primary">{index + 1}</span>
                            </div>
                            <p className="text-sm text-foreground">{guideline}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="community" className="mt-0">
                <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Community Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-96 bg-muted/20 rounded-xl p-4 overflow-y-auto space-y-3">
                      {comments.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">
                            {liveSession ? 'No messages yet. Start the conversation!' : 'Be the first to comment!'}
                          </p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {comment.user.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold">{comment.user}</span> {comment.message}
                              </p>
                              <div className="flex space-x-2 mt-1">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  {Math.floor(Math.random() * 20)}
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {/* Add some sample messages if no comments exist */}
                      {comments.length === 0 && (
                        <>
                          <div className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">JD</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm text-foreground"><span className="font-semibold">John D.</span> Thank you for this safe space 🙏</p>
                              <div className="flex space-x-2 mt-1">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  12
                                </Button>
                                <span className="text-xs text-muted-foreground">2 min ago</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">ML</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm text-foreground"><span className="font-semibold">Maria L.</span> One day at a time ✨</p>
                              <div className="flex space-x-2 mt-1">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  8
                                </Button>
                                <span className="text-xs text-muted-foreground">5 min ago</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Share your thoughts with kindness..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-4 py-2 bg-muted/30 border border-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                      />
                      <Button
                        onClick={handleSendComment}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <div className="space-y-6">
                  {/* Playlist */}
                  {looproomData.playlist && (
                    <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-foreground flex items-center">
                          <Volume2 className="w-5 h-5 mr-2" />
                          Session Playlist
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {looproomData.playlist.map((track) => (
                          <div key={track.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-xl transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                                <Volume2 className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{track.title}</p>
                                <p className="text-sm text-muted-foreground">{track.artist} • {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <PlayCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Additional Resources */}
                  <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-foreground">Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <h4 className="font-semibold text-foreground mb-2">Recovery Journal Prompts</h4>
                        <p className="text-sm text-muted-foreground">Downloadable journal prompts to continue your reflection after the session.</p>
                        <Button variant="outline" size="sm" className="mt-2 rounded-lg">
                          Download PDF
                        </Button>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-xl">
                        <h4 className="font-semibold text-foreground mb-2">Crisis Support Resources</h4>
                        <p className="text-sm text-muted-foreground">24/7 support hotlines and emergency resources for when you need immediate help.</p>
                        <Button variant="outline" size="sm" className="mt-2 rounded-lg">
                          View Resources
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Creator Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Session Leader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl">{looproomData.creator.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-foreground">{looproomData.creator.name}</h3>
                      {looproomData.creator.isVerified && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Licensed Recovery Specialist</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">4.9</span>
                      <span className="text-sm text-muted-foreground">(127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full rounded-xl">
                    Follow Creator
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{looproomData.currentParticipants}</p>
                    <p className="text-xs text-muted-foreground">Participants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">{looproomData.duration}</p>
                    <p className="text-xs text-muted-foreground">Minutes</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span className="text-foreground">{looproomData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Theme:</span>
                    <Badge className={`${themeConfig.color} bg-transparent border ${themeConfig.border}`}>
                      {themeConfig.name}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="text-foreground">English</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Sessions */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Related Sessions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Evening Reflection', time: '7:00 PM', participants: 18 },
                  { title: 'Weekend Workshop', time: 'Sat 10:00 AM', participants: 45 },
                  { title: 'Newcomer Circle', time: 'Sun 2:00 PM', participants: 12 }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-xl cursor-pointer transition-colors">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{session.title}</p>
                      <p className="text-xs text-muted-foreground">{session.time} • {session.participants} joining</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">
                      Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Looproom;