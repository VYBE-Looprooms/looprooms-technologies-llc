import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Play,
  Calendar,
  TrendingUp,
  Users,
  Brain,
  Dumbbell,
  Music,
  Palette,
  Plus,
  Image as ImageIcon,
  Video,
  Mic,
  Smile,
  Send,
  Clock,
  MapPin,
  Star,
  Award,
  Flame,
  Sparkles
} from 'lucide-react';

// VYBE LOOPROOMS™ Theme System - Using CSS Variables Only
const THEME_COLORS = {
  recovery: {
    bg: 'bg-card/80',
    text: 'text-primary',
    icon: 'text-primary',
    border: 'border-primary/30',
    accent: 'bg-primary',
    hover: 'hover:bg-card',
    gradient: 'from-primary via-primary to-secondary', // Uses theme CSS variables
    glow: 'shadow-primary/20'
  },
  meditation: {
    bg: 'bg-card/80',
    text: 'text-secondary',
    icon: 'text-secondary',
    border: 'border-secondary/30',
    accent: 'bg-secondary',
    hover: 'hover:bg-card',
    gradient: 'from-secondary via-secondary to-accent', // Uses theme CSS variables
    glow: 'shadow-secondary/20'
  },
  fitness: {
    bg: 'bg-card/80',
    text: 'text-accent',
    icon: 'text-accent',
    border: 'border-accent/30',
    accent: 'bg-accent',
    hover: 'hover:bg-card',
    gradient: 'from-accent via-accent to-primary', // Uses theme CSS variables
    glow: 'shadow-accent/20'
  }
};

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

// Motivational micro-text for reactions
const REACTION_MESSAGES = {
  fire: "You're on fire!",
  heart: "Stay strong!",
  growth: "Keep growing!",
  sparkle: "Keep going!"
};

// Loopchain sequences for guided journeys
const LOOPCHAIN_PATHS = {
  healing: ['recovery', 'meditation', 'fitness'],
  wellness: ['meditation', 'fitness', 'recovery'],
  growth: ['fitness', 'recovery', 'meditation']
};

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    isCreator: boolean;
    isVerified: boolean;
    title?: string;
  };
  content: string;
  timestamp: string;
  theme: keyof typeof THEME_COLORS;
  isAnonymous?: boolean;
  images?: string[];
  looproom?: {
    id: string;
    title: string;
    category: string;
    participants: number;
    isLive: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  reactions: {
    fire: number;
    heart: number;
    growth: number;
    sparkle: number;
  };
  userReacted?: string | null;
  isBookmarked?: boolean;
}

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof THEME_COLORS>('recovery');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    // Mock data for professional social feed
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          id: '1',
          name: 'Sarah Chen',
          avatar: '',
          isCreator: true,
          isVerified: true,
          title: 'Recovery Coach'
        },
        content: "Day 100 of my recovery journey! 🎉 The breathwork sessions in our looproom have been transformative. Sharing this milestone because someone out there needs to know that healing is possible. Your struggles are valid, your progress is meaningful, and you're not alone in this journey. 💙",
        timestamp: '2 hours ago',
        theme: 'recovery',
        looproom: {
          id: 'recovery-1',
          title: 'Morning Breathwork Circle',
          category: 'Recovery & Healing',
          participants: 234,
          isLive: true
        },
        stats: { likes: 127, comments: 23, shares: 8 },
        reactions: { fire: 45, heart: 82, growth: 28, sparkle: 15 },
        userReacted: 'heart'
      },
      {
        id: '2',
        author: {
          id: '2',
          name: 'Marcus Rodriguez',
          avatar: '',
          isCreator: false,
          isVerified: false
        },
        content: "Started my meditation practice 30 days ago and I can already feel the difference. The guided sessions in the mindfulness looproom help me stay grounded during stressful moments. Thank you to this amazing community for the support! 🧘‍♂️✨",
        timestamp: '4 hours ago',
        theme: 'meditation',
        stats: { likes: 89, comments: 15, shares: 4 },
        reactions: { fire: 12, heart: 67, growth: 34, sparkle: 8 },
        isBookmarked: true
      },
      {
        id: '3',
        author: {
          id: '3',
          name: 'Anonymous Warrior',
          avatar: '',
          isCreator: false,
          isVerified: false
        },
        content: "One year clean today. This platform gave me the courage to share my story and connect with others who understand. The recovery looprooms saved my life. If you're reading this and struggling, please don't give up. Healing is possible. 💪❤️",
        timestamp: '6 hours ago',
        theme: 'recovery',
        isAnonymous: true,
        stats: { likes: 312, comments: 67, shares: 45 },
        reactions: { fire: 89, heart: 156, growth: 67, sparkle: 23 },
        userReacted: 'fire'
      },
      {
        id: '4',
        author: {
          id: '4',
          name: 'Emma Thompson',
          avatar: '',
          isCreator: true,
          isVerified: true,
          title: 'Fitness & Wellness Guide'
        },
        content: "New 'Mindful Movement' looproom starting tomorrow! We'll combine gentle yoga with mindfulness practices. Perfect for beginners and those recovering from trauma. Movement is medicine, and every body is welcome here. 🌱💚",
        timestamp: '8 hours ago',
        theme: 'fitness',
        looproom: {
          id: 'fitness-1',
          title: 'Mindful Movement Flow',
          category: 'Fitness & Wellness',
          participants: 89,
          isLive: false
        },
        stats: { likes: 145, comments: 31, shares: 12 },
        reactions: { fire: 34, heart: 78, growth: 45, sparkle: 19 }
      },
      {
        id: '5',
        author: {
          id: '5',
          name: 'Alex Kim',
          avatar: '',
          isCreator: true,
          isVerified: true,
          title: 'Sound Healing Practitioner'
        },
        content: "The power of sound in healing cannot be overstated. Tonight's sound bath session was incredibly moving - watching people release trauma through vibrational healing reminds me why I do this work. Thank you to everyone who joined us. 🎵✨",
        timestamp: '12 hours ago',
        theme: 'music',
        images: ['/api/placeholder/400/300'],
        stats: { likes: 98, comments: 19, shares: 7 },
        reactions: { fire: 23, heart: 45, growth: 28, sparkle: 34 }
      }
    ];

    setPosts(mockPosts);
  }, []);

  const handleReaction = (postId: string, reaction: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReactions = { ...post.reactions };
        if (post.userReacted === reaction) {
          // Remove reaction
          newReactions[reaction as keyof typeof newReactions]--;
          return { ...post, reactions: newReactions, userReacted: null };
        } else {
          // Add new reaction, remove old one if exists
          if (post.userReacted) {
            newReactions[post.userReacted as keyof typeof newReactions]--;
          }
          newReactions[reaction as keyof typeof newReactions]++;
          return { ...post, reactions: newReactions, userReacted: reaction };
        }
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const newPostObj: Post = {
      id: Date.now().toString(),
      author: {
        id: 'current-user',
        name: isAnonymous ? 'Anonymous' : 'You',
        isCreator: false,
        isVerified: false
      },
      content: newPost,
      timestamp: 'Just now',
      theme: selectedTheme,
      isAnonymous,
      stats: { likes: 0, comments: 0, shares: 0 },
      reactions: { fire: 0, heart: 0, growth: 0, sparkle: 0 }
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
  };

  const getThemeColors = (theme: keyof typeof THEME_COLORS) => {
    return THEME_COLORS[theme] || THEME_COLORS.recovery;
  };

  const getThemeIcon = (theme: keyof typeof THEME_COLORS) => {
    return THEME_ICONS[theme] || Heart;
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Suggested Loopchain - Journey Path */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h3 className="font-bold text-foreground text-lg mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Your Healing Journey
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                {['recovery', 'meditation', 'fitness'].map((theme, index, array) => {
                  const ThemeIcon = THEME_ICONS[theme as keyof typeof THEME_ICONS];
                  const isActive = index === 0;
                  const isCompleted = false;

                  return (
                    <React.Fragment key={theme}>
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                          : isCompleted
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <ThemeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      {index < array.length - 1 && (
                        <div className={`w-6 sm:w-8 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-muted'} transition-all`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Start with <span className="text-primary font-semibold">Recovery</span> to build your foundation, then flow into meditation and fitness.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground sm:ml-4 w-full sm:w-auto">
              Continue Journey
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Post - Desktop Only */}
      <Card className="hidden lg:block shadow-sm border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Share your healing journey, celebrate a milestone, or inspire others..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="border-0 shadow-none resize-none min-h-[80px] text-base placeholder:text-gray-500 focus-visible:ring-0 p-0"
              />

              {/* Looproom Selection */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(THEME_COLORS).map(([theme, colors]) => {
                  const IconComponent = getThemeIcon(theme as keyof typeof THEME_COLORS);
                  const isSelected = selectedTheme === theme;

                  return (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme as keyof typeof THEME_COLORS)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${colors.gradient} text-primary-foreground shadow-lg border-2 border-primary/20`
                          : 'bg-card border border-border/30 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="capitalize">{theme} Looproom</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Mic className="w-5 h-5 mr-2" />
                    Voice Note
                  </Button>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-muted-foreground">Share anonymously</span>
                  </label>
                </div>

                <Button
                  onClick={handleSubmitPost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feed Posts - Mobile Responsive */}
      <div className="space-y-0 lg:space-y-6">
        {posts.map((post) => {
          const themeColors = getThemeColors(post.theme);
          const ThemeIcon = getThemeIcon(post.theme);

          return (
            <Card key={post.id} className={`border-2 ${themeColors.border} bg-card/80 backdrop-blur-sm hover:shadow-xl ${themeColors.glow} transition-all duration-300 lg:rounded-xl rounded-none mb-0 lg:mb-0 relative overflow-hidden`}>
              {/* Looproom Gradient Label */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${themeColors.gradient}`}></div>
              {/* Post Header */}
              <CardContent className="p-4 lg:p-6 pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                      {post.author.avatar ? (
                        <AvatarImage src={post.author.avatar} />
                      ) : (
                        <AvatarFallback className={`text-primary-foreground font-semibold ${
                          post.isAnonymous
                            ? 'bg-muted'
                            : post.author.isCreator
                            ? 'bg-gradient-to-r from-primary to-secondary'
                            : 'bg-gradient-to-r from-primary/70 to-secondary/70'
                        }`}>
                          {post.isAnonymous ? '?' : post.author.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground text-sm lg:text-base">
                          {post.isAnonymous ? 'Anonymous Warrior' : post.author.name}
                        </h3>
                        {post.author.isVerified && (
                          <Award className="w-4 h-4 text-primary" />
                        )}
                        {post.author.isCreator && (
                          <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs px-2 py-1">
                            Creator
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 flex-wrap">
                        <Badge className={`text-xs bg-gradient-to-r ${themeColors.gradient} text-primary-foreground border-0 font-semibold px-3 py-1 shadow-sm`}>
                          <ThemeIcon className="w-3 h-3 mr-1" />
                          {post.theme.toUpperCase()} LOOPROOM
                        </Badge>
                        {post.author.title && (
                          <>
                            <span className="text-muted-foreground hidden lg:inline">•</span>
                            <span className="text-sm text-muted-foreground hidden lg:inline">{post.author.title}</span>
                          </>
                        )}
                        <span className="text-muted-foreground">•</span>
                        <span className="text-xs lg:text-sm text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="p-1 lg:p-2">
                    <MoreHorizontal className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-foreground leading-relaxed text-sm lg:text-base">{post.content}</p>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="mt-4 rounded-xl overflow-hidden">
                      <img
                        src={post.images[0]}
                        alt="Post content"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Looproom Preview */}
                  {post.looproom && (
                    <div className={`mt-4 p-3 lg:p-4 rounded-xl ${themeColors.bg} ${themeColors.border} border`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${themeColors.accent} flex items-center justify-center`}>
                            {post.looproom.isLive ? (
                              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                            ) : (
                              <Play className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm lg:text-base">{post.looproom.title}</h4>
                            <p className="text-xs lg:text-sm text-muted-foreground">{post.looproom.category}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {post.looproom.participants} participants
                              </span>
                              {post.looproom.isLive && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  🔴 LIVE
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className={`${themeColors.text} border-current text-xs lg:text-sm`} variant="outline">
                          {post.looproom.isLive ? 'Join Live' : 'Join'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reactions Bar with Motivational Micro-text */}
                <div className="flex items-center gap-1 lg:gap-2 mb-4 overflow-x-auto pb-1">
                  {[
                    { type: 'fire', emoji: '🔥', count: post.reactions.fire, message: REACTION_MESSAGES.fire },
                    { type: 'heart', emoji: '💙', count: post.reactions.heart, message: REACTION_MESSAGES.heart },
                    { type: 'growth', emoji: '🌱', count: post.reactions.growth, message: REACTION_MESSAGES.growth },
                    { type: 'sparkle', emoji: '✨', count: post.reactions.sparkle, message: REACTION_MESSAGES.sparkle }
                  ].map(({ type, emoji, count, message }) => (
                    <div key={type} className="relative group">
                      <button
                        onClick={() => handleReaction(post.id, type)}
                        className={`flex items-center space-x-1 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm transition-all hover:bg-muted/60 whitespace-nowrap ${
                          post.userReacted === type
                            ? `bg-gradient-to-r ${themeColors.gradient} text-primary-foreground shadow-md ring-2 ring-primary/20`
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-sm lg:text-base">{emoji}</span>
                        <span className="font-medium">{count}</span>
                      </button>

                      {/* Motivational Micro-text Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {message}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-foreground"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Action Bar - Mobile Responsive */}
              <CardContent className="px-4 lg:px-6 py-3 lg:py-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary p-0">
                      <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                      <span className="font-medium text-xs lg:text-sm">{post.stats.likes}</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-secondary p-0">
                      <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                      <span className="font-medium text-xs lg:text-sm">{post.stats.comments}</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent p-0">
                      <Share2 className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                      <span className="font-medium text-xs lg:text-sm">{post.stats.shares}</span>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBookmark(post.id)}
                    className={`p-1 ${post.isBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  >
                    <Bookmark className={`w-4 h-4 lg:w-5 lg:h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Load More - Mobile Responsive */}
      <div className="text-center py-6 lg:py-8">
        <Button variant="outline" size="lg" className="px-6 lg:px-8">
          <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
          <span className="text-sm lg:text-base">Load More Stories</span>
        </Button>
      </div>

      {/* Mobile Floating Compose Button */}
      <Button
        onClick={() => console.log('Open mobile compose')}
        className="lg:hidden fixed bottom-28 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        size="sm"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </Button>
    </div>
  );
};

export default SocialFeed;