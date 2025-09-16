import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Bell,
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Settings,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'reaction' | 'comment' | 'session_reminder' | 'achievement' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isNew: boolean;
  actionUrl?: string;
  actor?: {
    name: string;
    avatar?: string;
    isCreator?: boolean;
  };
  meta?: {
    reactionType?: string;
    sessionTitle?: string;
    achievementName?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reaction',
    title: 'New reaction on your VYBE',
    message: 'Sarah reacted with 🔥 to your recovery milestone post',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isRead: false,
    isNew: true,
    actionUrl: '/feed',
    actor: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=100&h=100&fit=crop&crop=faces',
      isCreator: false
    },
    meta: {
      reactionType: 'fire'
    }
  },
  {
    id: '2',
    type: 'session_reminder',
    title: 'Session starting soon',
    message: 'Mindful Morning Meditation with Alex starts in 30 minutes',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    isNew: true,
    actionUrl: '/looproom/session-123',
    actor: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      isCreator: true
    },
    meta: {
      sessionTitle: 'Mindful Morning Meditation'
    }
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Achievement unlocked! 🎉',
    message: 'Congratulations! You\'ve completed your 7-day meditation streak',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    isNew: false,
    actionUrl: '/profile/achievements',
    meta: {
      achievementName: '7-Day Meditation Master'
    }
  },
  {
    id: '4',
    type: 'comment',
    title: 'New comment on your VYBE',
    message: 'Mike commented: "This really resonates with me. Thank you for sharing!"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isRead: true,
    isNew: false,
    actionUrl: '/feed',
    actor: {
      name: 'Mike Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
      isCreator: false
    }
  },
  {
    id: '5',
    type: 'social',
    title: 'New follower',
    message: 'Emma started following your VYBE journey',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: true,
    isNew: false,
    actionUrl: '/profile/emma-wilson',
    actor: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
      isCreator: false
    }
  },
  {
    id: '6',
    type: 'system',
    title: 'Weekly progress summary',
    message: 'Your wellness journey this week: 5 sessions completed, 3 new VYBEs shared',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    isNew: false,
    actionUrl: '/progress'
  }
];

const getNotificationIcon = (type: Notification['type'], meta?: Notification['meta']) => {
  switch (type) {
    case 'reaction':
      if (meta?.reactionType === 'fire') return <Flame className="w-4 h-4 text-orange-500" />;
      if (meta?.reactionType === 'heart') return <Heart className="w-4 h-4 text-red-500" />;
      if (meta?.reactionType === 'growth') return <TrendingUp className="w-4 h-4 text-green-500" />;
      return <Heart className="w-4 h-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-blue-500" />;
    case 'session_reminder':
      return <Calendar className="w-4 h-4 text-purple-500" />;
    case 'achievement':
      return <Star className="w-4 h-4 text-yellow-500" />;
    case 'social':
      return <Users className="w-4 h-4 text-green-500" />;
    case 'system':
      return <Bell className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'today'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return notification.timestamp >= today;
    }
    return true;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true, isNew: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true, isNew: false }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="rounded-xl"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mt-4 bg-muted/50 rounded-xl p-1 w-fit">
            {(['all', 'unread', 'today'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === filterOption
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filterOption}
                {filterOption === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </h3>
              <p className="text-muted-foreground">
                {filter === 'unread'
                  ? 'You have no unread notifications'
                  : 'Your notifications will appear here when you receive them'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl transition-all duration-200 hover:shadow-lg cursor-pointer ${
                  !notification.isRead ? 'border-primary/20 shadow-md' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Icon/Avatar */}
                    <div className="flex-shrink-0 relative">
                      {notification.actor?.avatar ? (
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {notification.actor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type, notification.meta)}
                        </div>
                      )}

                      {/* Notification type indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border/30">
                        {getNotificationIcon(notification.type, notification.meta)}
                      </div>

                      {/* New indicator */}
                      {notification.isNew && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </span>
                            {notification.actor?.isCreator && (
                              <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                                Creator
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        <div className="flex items-center space-x-2 ml-3">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;