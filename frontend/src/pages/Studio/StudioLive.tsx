import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageCircle,
  Settings,
  Share2,
  Monitor,
  Smartphone,
  Wifi,
  WifiOff,
  Circle,
  Square,
  Heart,
  Flame,
  Eye,
  Clock,
  Volume2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'preparing' | 'live' | 'ended';
  startTime: Date;
  duration: number; // minutes
  currentParticipants: number;
  maxParticipants: number;
  viewerCount: number;
  isRecording: boolean;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isAnonymous: boolean;
  joinedAt: Date;
  isMuted: boolean;
  reactions: number;
}

const StudioLive: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [session, setSession] = useState<LiveSession>({
    id: sessionId || 'live-session-1',
    title: 'Mindful Morning Meditation',
    description: 'Start your day with peaceful meditation and breathing exercises',
    category: 'Meditation',
    status: 'preparing',
    startTime: new Date(),
    duration: 30,
    currentParticipants: 0,
    maxParticipants: 30,
    viewerCount: 0,
    isRecording: false
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const handleStartStream = () => {
    setIsLive(true);
    setSession(prev => ({
      ...prev,
      status: 'live',
      startTime: new Date()
    }));
  };

  const handleEndStream = () => {
    setIsLive(false);
    setSession(prev => ({
      ...prev,
      status: 'ended'
    }));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Studio
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Live Studio</h1>
                <div className="flex items-center space-x-2 mt-1">
                  {isLive ? (
                    <div className="flex items-center space-x-1 text-red-600">
                      <Circle className="w-2 h-2 fill-current animate-pulse" />
                      <span className="text-sm font-medium">LIVE</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Preparing</span>
                  )}
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{session.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                {connectionStatus === 'connected' ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="capitalize">{connectionStatus}</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Feed */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/80 relative">
                {/* Video placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoEnabled ? (
                    <div className="text-center">
                      <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your video feed will appear here</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Camera is off</p>
                    </div>
                  )}
                </div>

                {/* Live indicator */}
                {isLive && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Circle className="w-2 h-2 fill-current animate-pulse" />
                    <span>LIVE</span>
                  </div>
                )}

                {/* Stats overlay */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{session.viewerCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{session.currentParticipants}</span>
                    </div>
                    {isLive && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>00:00</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant={isVideoEnabled ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                      className="rounded-xl"
                    >
                      {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant={isAudioEnabled ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                      className="rounded-xl"
                    >
                      {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!isLive ? (
                      <Button
                        onClick={handleStartStream}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                        disabled={!isVideoEnabled && !isAudioEnabled}
                      >
                        <Circle className="w-4 h-4 mr-2" />
                        Go Live
                      </Button>
                    ) : (
                      <Button
                        onClick={handleEndStream}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        End Stream
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-foreground mb-2">{session.title}</h2>
                    <p className="text-muted-foreground mb-4">{session.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {formatDuration(session.duration)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Max participants: {session.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  <Avatar className="w-12 h-12">
                    {user?.profile?.avatarUrl ? (
                      <AvatarImage src={user.profile.avatarUrl} alt={user.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {user?.username?.charAt(0) || 'C'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Participants</span>
                  </div>
                  <span className="text-sm font-normal text-muted-foreground">
                    {session.currentParticipants}/{session.maxParticipants}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {participants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No participants yet
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Participants will appear here when they join
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                        <Avatar className="w-8 h-8">
                          {participant.avatar && !participant.isAnonymous ? (
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                          ) : (
                            <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                              {participant.isAnonymous ? '?' : participant.name.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {participant.isAnonymous ? 'Anonymous' : participant.name}
                          </p>
                          <div className="flex items-center space-x-1">
                            {participant.isMuted && <MicOff className="w-3 h-3 text-muted-foreground" />}
                            <span className="text-xs text-muted-foreground">
                              {participant.reactions} reactions
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Live Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-64 overflow-y-auto mb-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        No messages yet
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Messages from participants will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div key={message.id} className="text-sm">
                          <span className="font-medium text-primary">{message.author}:</span>
                          <span className="text-foreground ml-2">{message.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{session.viewerCount}</div>
                    <div className="text-xs text-muted-foreground">Viewers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{session.currentParticipants}</div>
                    <div className="text-xs text-muted-foreground">Joined</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioLive;