import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VYBEReactions, { VYBEReaction } from '@/components/VYBEReactions';
import LoopchainStories from './LoopchainStories';
import type { LoopchainConnection, RippleEffect } from './LoopchainStories';
import { CreatorSpotlightCard, WeeklyReflectionCard } from '@/components/CreatorSpotlight';
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
  Zap,
  Camera,
  Smile,
  Image as ImageIcon,
  Send,
  EyeOff,
  Award,
  Link2,
  Sparkles,
  Target,
  Trophy,
  Flame,
  Star
} from 'lucide-react';

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    isCreator: boolean;
    title?: string;
    isVerified?: boolean;
  };
  content: string;
  type: 'reflection' | 'milestone' | 'inspiration' | 'progress';
  looproom?: {
    id: string;
    title: string;
    category: string;
    thumbnail?: string;
    progress?: number;
    badge?: string;
  };
  vybeReactions: VYBEReaction[];
  vybeScore: number;
  impactCount: number;
  comments: {
    count: number;
  };
  timestamp: string;
  isAnonymous?: boolean;
  
  // Loopchain features
  loopchainConnections: LoopchainConnection[];
  rippleEffect?: RippleEffect;
  
  // Achievement badges
  milestoneAchieved?: {
    title: string;
    description: string;
    icon: string;
    progress: number;
  };
  
  // Creator spotlight
  featured?: boolean;
  trending?: boolean;
}

const SocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'reflection' | 'milestone' | 'inspiration' | 'progress'>('reflection');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Enhanced mock data with VYBE ecosystem features
    const mockPosts: FeedPost[] = [
      {
        id: '1',
        user: {
          id: '1',
          name: 'Sarah M.',
          avatar: '/api/placeholder/40/40',
          isCreator: true,
          title: 'Recovery Coach',
          isVerified: true
        },
        content: 'Just completed my 10th Recovery Looproom session! 🙏 The breathing exercises are transforming how I process emotions. Each session builds on the last - feeling the power of consistent healing. Grateful for this journey and everyone walking it with me.',
        type: 'milestone',
        looproom: {
          id: 'recovery-1',
          title: 'Healing Through Breathwork',
          category: 'Recovery',
          thumbnail: '/api/placeholder/300/200',
          progress: 66,
          badge: 'Session Streak Champion'
        },
        vybeReactions: [
          { id: '1', type: 'progress', count: 12, userReacted: false },
          { id: '2', type: 'inspired', count: 8, userReacted: true },
          { id: '3', type: 'growth', count: 15, userReacted: false },
          { id: '4', type: 'breakthrough', count: 5, userReacted: false }
        ],
        vybeScore: 340,
        impactCount: 24,
        comments: { count: 8 },
        timestamp: '2 hours ago',
        loopchainConnections: [
          {
            id: 'conn1',
            fromPostId: '1',
            toPostId: '2',
            connectionType: 'inspired',
            strength: 4
          }
        ],
        rippleEffect: {
          id: 'ripple1',
          originPostId: '1',
          impactRadius: 3,
          inspirationCount: 12,
          actionsTaken: 6,
          communities: ['Recovery', 'Meditation']
        },
        milestoneAchieved: {
          title: '10 Session Milestone',
          description: 'Completed 10 Recovery sessions',
          icon: '🏆',
          progress: 100
        },
        featured: true
      },
      {
        id: '2',
        user: {
          id: '2',
          name: 'Anonymous',
          isCreator: false
        },
        content: 'Day 30 of my recovery journey! 💪 Started with the fitness looproom this morning and feeling stronger than ever. Sarah\'s breathing post yesterday inspired me to try something new. The progress tracking feature is incredible - seeing how far I\'ve come gives me hope for tomorrow.',
        type: 'progress',
        looproom: {
          id: 'fitness-1',
          title: 'Morning Energy Flow',
          category: 'Fitness',
          progress: 45
        },
        vybeReactions: [
          { id: '1', type: 'progress', count: 18, userReacted: true },
          { id: '2', type: 'inspired', count: 12, userReacted: false },
          { id: '3', type: 'growth', count: 7, userReacted: false },
          { id: '4', type: 'breakthrough', count: 10, userReacted: false }
        ],
        vybeScore: 285,
        impactCount: 47,
        comments: { count: 15 },
        timestamp: '4 hours ago',
        isAnonymous: true,
        loopchainConnections: [
          {
            id: 'conn2',
            fromPostId: '2',
            toPostId: '1',
            connectionType: 'inspired',
            strength: 5
          }
        ]
      },
      {
        id: '3',
        user: {
          id: '3',
          name: 'Marcus Chen',
          avatar: '/api/placeholder/40/40',
          isCreator: true,
          title: 'Mindfulness Guide',
          isVerified: true
        },
        content: 'Reminder: Your healing journey is not linear. 🌱 Some days will be harder than others, and that\'s completely okay. Every small step forward matters - I see you all growing stronger in your Looprooms. The ripple effect of courage is beautiful to witness. You\'re stronger than you know. 💚',
        type: 'inspiration',
        vybeReactions: [
          { id: '1', type: 'progress', count: 25, userReacted: false },
          { id: '2', type: 'inspired', count: 32, userReacted: false },
          { id: '3', type: 'growth', count: 18, userReacted: true },
          { id: '4', type: 'breakthrough', count: 14, userReacted: false }
        ],
        vybeScore: 520,
        impactCount: 89,
        comments: { count: 23 },
        timestamp: '6 hours ago',
        loopchainConnections: [],
        trending: true
      }
    ];
    
    // Simulate API call
    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const post: FeedPost = {
        id: Date.now().toString(),
        user: {
          id: 'current-user',
          name: isAnonymous ? 'Anonymous' : 'You',
          isCreator: false
        },
        content: newPost,
        type: postType,
        vybeReactions: [
          { id: '1', type: 'progress', count: 0, userReacted: false },
          { id: '2', type: 'inspired', count: 0, userReacted: false },
          { id: '3', type: 'growth', count: 0, userReacted: false },
          { id: '4', type: 'breakthrough', count: 0, userReacted: false }
        ],
        vybeScore: 0,
        impactCount: 0,
        comments: { count: 0 },
        timestamp: 'Just now',
        isAnonymous,
        loopchainConnections: []
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost('');
      setLoading(false);
    }, 1000);
  };

  const handleVYBEReaction = (postId: string, type: 'progress' | 'inspired' | 'growth' | 'breakthrough') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const updatedReactions = post.vybeReactions.map(reaction => {
          if (reaction.type === type) {
            return {
              ...reaction,
              count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
              userReacted: !reaction.userReacted
            };
          }
          return reaction;
        });
        
        // Update VYBE score based on reaction types
        const vybeScoreChange = type === 'breakthrough' ? 3 : type === 'growth' ? 2 : 1;
        const newVybeScore = post.vybeScore + (updatedReactions.find(r => r.type === type)?.userReacted ? vybeScoreChange : -vybeScoreChange);
        
        return {
          ...post,
          vybeReactions: updatedReactions,
          vybeScore: Math.max(0, newVybeScore),
          impactCount: post.impactCount + (updatedReactions.find(r => r.type === type)?.userReacted ? 1 : -1)
        };
      }
      return post;
    }));
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'reflection': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'milestone': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'inspiration': return 'bg-vybe-secondary/10 text-vybe-secondary border-vybe-secondary/30 dark:bg-vybe-secondary/20 dark:text-vybe-secondary dark:border-vybe-secondary/40';
      case 'progress': return 'bg-vybe-primary/10 text-vybe-primary border-vybe-primary/30 dark:bg-vybe-primary/20 dark:text-vybe-primary dark:border-vybe-primary/40';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'reflection': return MessageCircle;
      case 'milestone': return TrendingUp;
      case 'inspiration': return Zap;
      case 'progress': return Calendar;
      default: return MessageCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Creator Spotlight & Weekly Reflection - Top of Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreatorSpotlightCard 
          spotlights={[
            {
              id: '1',
              creator: {
                id: '1',
                name: 'Sarah M.',
                avatar: '/api/placeholder/40/40',
                title: 'Recovery Coach',
                isVerified: true
              },
              impactMetrics: {
                storiesInspired: 47,
                totalReach: 1250,
                transformationRate: 78,
                vybeScore: 2340
              },
              featuredStory: {
                id: '1',
                title: 'Healing Through Breathwork',
                excerpt: 'My 10-session journey transformed how I process emotions...',
                category: 'Recovery',
                reactions: 340
              },
              trending: true
            }
          ]}
          onViewCreator={(id) => console.log('View creator', id)}
        />
        
        <WeeklyReflectionCard 
          summary={{
            userId: 'current-user',
            weekStart: '2025-09-07',
            metrics: {
              storiesShared: 3,
              peopleInspired: 12,
              reactionsReceived: 47,
              chainConnections: 2,
              topCategory: 'Recovery',
              impactRadius: 3
            },
            achievements: [
              {
                id: '1',
                title: 'Inspiration Spark',
                description: 'Your story inspired 10+ people',
                type: 'impact',
                earned: true
              }
            ],
            rippleMap: [
              {
                yourPost: 'My recovery milestone',
                inspired: [
                  { userId: '2', action: 'joined Recovery Looproom', looproom: 'Healing Breathwork' },
                  { userId: '3', action: 'started meditation', looproom: 'Mindful Moments' }
                ]
              }
            ]
          }}
          onViewFullReport={() => console.log('View full report')}
        />
      </div>

      {/* Enhanced Create Post */}
      <Card className="bg-gradient-to-r from-background via-background to-vybe-primary/5 border-2 border-vybe-primary/10 shadow-xl">
        <CardHeader className="pb-4 px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-vybe-primary to-vybe-secondary bg-clip-text text-transparent">
                Share Your Transformation
              </CardTitle>
              <CardDescription className="text-base">
                Create emotional milestones that inspire the VYBE ecosystem
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-vybe-primary" />
              <Badge variant="outline" className="text-vybe-primary border-vybe-primary/30">
                Impact Ready
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          {/* Post Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              What milestone are you sharing?
            </label>
            <Select value={postType} onValueChange={(value) => setPostType(value as typeof postType)}>
              <SelectTrigger className="w-full h-14 text-left border-2 border-vybe-primary/20 hover:border-vybe-primary/40 transition-colors">
                <SelectValue>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = getPostTypeIcon(postType);
                      return (
                        <>
                          <div className={`p-3 rounded-full ${getPostTypeColor(postType)} bg-opacity-30`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold capitalize text-lg">{postType}</span>
                            <span className="text-sm text-muted-foreground">
                              {postType === 'reflection' && 'Share deep insights and learnings'}
                              {postType === 'milestone' && 'Celebrate meaningful achievements'}
                              {postType === 'inspiration' && 'Motivate and uplift others'}
                              {postType === 'progress' && 'Document your transformation'}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(['reflection', 'milestone', 'inspiration', 'progress'] as const).map((type) => {
                  const Icon = getPostTypeIcon(type);
                  return (
                    <SelectItem key={type} value={type} className="h-16 cursor-pointer">
                      <div className="flex items-center gap-3 w-full">
                        <div className={`p-2 rounded-full ${getPostTypeColor(type)} bg-opacity-20 flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <span className="font-medium capitalize">{type}</span>
                          <span className="text-xs text-muted-foreground">
                            {type === 'reflection' && 'Share deep insights and learnings'}
                            {type === 'milestone' && 'Celebrate meaningful achievements'}
                            {type === 'inspiration' && 'Motivate and uplift others'}
                            {type === 'progress' && 'Document your transformation'}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-vybe-accent/20 rounded-lg border border-vybe-accent/30">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-vybe-accent" />
              <div>
                <div className="font-medium text-vybe-accent">Share Anonymously</div>
                <div className="text-sm text-vybe-accent/80">
                  Perfect for sensitive recovery stories (NA/AA support)
                </div>
              </div>
            </div>
            <Switch 
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-vybe-accent"
            />
          </div>

          <Textarea
            placeholder={`Share your ${postType} story... What transformation are you experiencing? How can your journey inspire others in the VYBE ecosystem?`}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[120px] resize-none border-2 border-vybe-primary/20 focus:border-vybe-primary/40 text-base"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Button variant="outline" size="sm" className="min-h-[44px] px-4 flex-shrink-0 border-vybe-primary/30 hover:bg-vybe-primary/10">
                <ImageIcon className="w-4 h-4 mr-2" />
                <span>Milestone Photo</span>
              </Button>
              <Button variant="outline" size="sm" className="min-h-[44px] px-4 flex-shrink-0 border-vybe-primary/30 hover:bg-vybe-primary/10">
                <Camera className="w-4 h-4 mr-2" />
                <span>Looproom Link</span>
              </Button>
              <Button variant="outline" size="sm" className="min-h-[44px] px-4 flex-shrink-0 border-vybe-primary/30 hover:bg-vybe-primary/10">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Achievement</span>
              </Button>
            </div>

            <Button 
              onClick={handleSubmitPost}
              disabled={!newPost.trim() || loading}
              size="lg"
              className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-vybe-primary to-vybe-secondary hover:from-vybe-primary/90 hover:to-vybe-secondary/90 text-white px-8 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? 'Creating Impact...' : 'Share Transformation'}
            </Button>
          </div>

          {/* VYBE Impact Preview */}
          <div className="flex items-center justify-center p-3 bg-gradient-to-r from-vybe-primary/10 to-vybe-secondary/10 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-vybe-primary font-medium">
              <Flame className="w-4 h-4" />
              Your story has the power to inspire transformations across the ecosystem
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revolutionary Feed Posts */}
      <div className="space-y-8">
        {posts.map((post) => {
          const PostTypeIcon = getPostTypeIcon(post.type);
          const hasLoopchainConnection = post.loopchainConnections.length > 0;
          
          return (
            <Card 
              key={post.id} 
              className={`group hover:shadow-2xl transition-all duration-300 border-2 ${
                post.featured 
                  ? 'border-vybe-accent/50 bg-gradient-to-br from-vybe-accent/10 to-vybe-secondary/10 dark:from-vybe-accent/20 dark:to-vybe-secondary/20' 
                  : hasLoopchainConnection
                  ? 'border-vybe-primary/30 bg-gradient-to-br from-vybe-primary/5 to-vybe-secondary/5'
                  : 'border-border hover:border-vybe-primary/30'
              }`}
            >
              <CardContent className="p-6 space-y-6">
                {/* Enhanced Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Avatar className="w-12 h-12 ring-2 ring-vybe-primary/20">
                      {post.user.avatar ? (
                        <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      ) : (
                        <AvatarFallback className="bg-vybe-primary/10 text-vybe-primary font-semibold">
                          {post.isAnonymous ? '?' : post.user.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-foreground text-lg">
                          {post.isAnonymous ? 'Anonymous Hero' : post.user.name}
                        </h4>
                        {post.user.isCreator && (
                          <Badge variant="secondary" className="text-xs bg-vybe-secondary/20 text-vybe-secondary border-vybe-secondary/30">
                            <Award className="w-3 h-3 mr-1" />
                            Creator
                          </Badge>
                        )}
                        {post.user.isVerified && (
                          <Award className="w-4 h-4 text-blue-500" />
                        )}
                        {post.featured && (
                          <Badge className="text-xs bg-vybe-accent text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {post.trending && (
                          <Badge className="text-xs bg-vybe-primary text-white">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={`text-xs flex-shrink-0 ${getPostTypeColor(post.type)} border-2`}
                        >
                          <PostTypeIcon className="w-3 h-3 mr-1" />
                          {post.type}
                        </Badge>
                        {post.user.title && (
                          <span className="text-sm text-muted-foreground">{post.user.title}</span>
                        )}
                        <span className="text-sm text-muted-foreground">•</span>
                        <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLoopchainConnection && (
                      <Link2 className="w-5 h-5 text-vybe-primary" />
                    )}
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <p className="text-foreground text-lg leading-relaxed font-medium">{post.content}</p>
                  
                  {/* Milestone Achievement */}
                  {post.milestoneAchieved && (
                    <Card className="bg-gradient-to-r from-vybe-secondary/20 to-vybe-accent/20 dark:from-vybe-secondary/30 dark:to-vybe-accent/30 border-vybe-secondary/40 dark:border-vybe-secondary/60">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{post.milestoneAchieved.icon}</div>
                          <div className="flex-1">
                            <h5 className="font-bold text-vybe-secondary dark:text-vybe-secondary">
                              {post.milestoneAchieved.title}
                            </h5>
                            <p className="text-sm text-vybe-secondary/80 dark:text-vybe-secondary/90">
                              {post.milestoneAchieved.description}
                            </p>
                            <Progress 
                              value={post.milestoneAchieved.progress} 
                              className="mt-2 h-2 bg-vybe-secondary/20" 
                            />
                          </div>
                          <Badge className="bg-vybe-accent text-white">
                            Achievement Unlocked!
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Enhanced Looproom Preview */}
                  {post.looproom && (
                    <Card className="bg-gradient-to-r from-vybe-primary/10 to-vybe-secondary/10 border-vybe-primary/30 shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-vybe-primary to-vybe-secondary rounded-xl flex items-center justify-center shadow-lg">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-foreground text-lg">{post.looproom.title}</h5>
                              {post.looproom.badge && (
                                <Badge variant="outline" className="text-xs bg-vybe-accent/20 text-vybe-accent border-vybe-accent/30">
                                  {post.looproom.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{post.looproom.category} Looproom</p>
                            {post.looproom.progress && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium text-vybe-primary">{post.looproom.progress}%</span>
                                </div>
                                <Progress value={post.looproom.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                          <Button size="sm" className="bg-vybe-primary hover:bg-vybe-primary/90 text-white">
                            <Play className="w-4 h-4 mr-1" />
                            Experience
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Loopchain Stories */}
                  <LoopchainStories
                    connections={post.loopchainConnections}
                    rippleEffect={post.rippleEffect}
                    isConnected={hasLoopchainConnection}
                    onExploreChain={() => console.log('Explore chain for post', post.id)}
                  />
                </div>

                {/* VYBE Reactions */}
                <VYBEReactions
                  reactions={post.vybeReactions}
                  vybeScore={post.vybeScore}
                  impactCount={post.impactCount}
                  onReact={(type) => handleVYBEReaction(post.id, type)}
                />

                {/* Enhanced Actions */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-vybe-primary/20">
                  <div className="flex items-center gap-6">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-vybe-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">{post.comments.count}</span>
                      <span className="hidden sm:inline">Comments</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-vybe-secondary transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Share Impact</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-vybe-accent transition-colors">
                      <Link2 className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">Add to Chain</span>
                    </Button>
                  </div>

                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-vybe-primary">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Creator Spotlight & Weekly Reflections - Bottom Section */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <CreatorSpotlightCard
            spotlights={[
              {
                id: 'spotlight-1',
                creator: {
                  id: 'creator-1',
                  name: 'Sarah Chen',
                  avatar: '',
                  title: 'Mindfulness & Recovery Guide',
                  isVerified: true
                },
                impactMetrics: {
                  storiesInspired: 847,
                  totalReach: 2847,
                  transformationRate: 87,
                  vybeScore: 2847
                },
                featuredStory: {
                  id: 'story-1',
                  title: 'Breaking Free: My 365-Day Journey',
                  excerpt: 'A year ago, I never imagined I could inspire hundreds of people to start their own recovery journey...',
                  category: 'Recovery',
                  reactions: 234
                },
                trending: true
              }
            ]}
            onViewCreator={(id) => console.log('View creator:', id)}
          />

          <WeeklyReflectionCard
            summary={{
              userId: 'current-user',
              weekStart: 'Nov 4, 2024',
              metrics: {
                storiesShared: 12,
                peopleInspired: 89,
                reactionsReceived: 156,
                chainConnections: 23,
                topCategory: 'Recovery',
                impactRadius: 1250
              },
              achievements: [
                {
                  id: 'ach-1',
                  title: 'Recovery Champion',
                  description: 'Inspired 50+ people to start recovery',
                  type: 'impact',
                  earned: true
                },
                {
                  id: 'ach-2',
                  title: 'Mindfulness Master',
                  description: '365 days of consistent meditation',
                  type: 'milestone',
                  earned: true
                }
              ],
              rippleMap: [
                {
                  yourPost: 'Day 100: Small steps, big changes',
                  inspired: [
                    {
                      userId: 'user-1',
                      action: 'Started meditation practice',
                      looproom: 'Mindful Recovery'
                    },
                    {
                      userId: 'user-2',
                      action: 'Joined support group',
                      looproom: 'Recovery Warriors'
                    }
                  ]
                }
              ]
            }}
            onViewFullReport={() => console.log('View full report')}
          />
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default SocialFeed;