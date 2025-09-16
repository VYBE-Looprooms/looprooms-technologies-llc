import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { socialFeedApi } from '@/services/api';
import {
  Heart,
  MessageCircle,
  Share,
  Flame,
  Sparkles,
  TrendingUp,
  MoreVertical,
  UserCheck,
  AlertTriangle,
  Send,
  RefreshCw,
  Users,
  Clock,
  Plus,
  Brain,
  Dumbbell
} from 'lucide-react';

// Types
interface FeedPost {
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
  theme: string;
  isAnonymous: boolean;
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
  userReacted?: string;
  isBookmarked: boolean;
  comments: Array<{
    id: string;
    content: string;
    author: string;
    timestamp: string;
  }>;
}

const REACTION_ICONS = {
  fire: Flame,
  heart: Heart,
  growth: TrendingUp,
  sparkle: Sparkles
};

const THEME_COLORS = {
  recovery: 'text-red-600 bg-red-50 border-red-200',
  meditation: 'text-blue-600 bg-blue-50 border-blue-200',
  fitness: 'text-green-600 bg-green-50 border-green-200',
  music: 'text-purple-600 bg-purple-50 border-purple-200',
  art: 'text-orange-600 bg-orange-50 border-orange-200'
};

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

interface SocialFeedProps {
  selectedTheme?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ selectedTheme = 'all' }) => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load feed posts
  useEffect(() => {
    loadFeedPosts();
  }, [selectedTheme]);

  const loadFeedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await socialFeedApi.getPosts({
        limit: 20,
        theme: selectedTheme !== 'all' ? selectedTheme : undefined,
        includeAnonymous: true
      });

      if (response.success && response.data) {
        setPosts(response.data);
      } else {
        setError('Failed to load posts');
      }

    } catch (err) {
      console.error('Error loading feed posts:', err);
      setError('Unable to load feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeedPosts();
    setRefreshing(false);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      setIsPosting(true);

      const response = await socialFeedApi.createPost({
        content: newPost.trim(),
        type: 'REFLECTION'
      });

      if (response.success) {
        setNewPost('');
        // Refresh feed to show new post
        await loadFeedPosts();
      } else {
        setError('Failed to create post');
      }

    } catch (err) {
      console.error('Error creating post:', err);
      setError('Unable to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.userReacted === reactionType.toLowerCase()) {
        // Remove reaction
        await socialFeedApi.removeReaction(postId);
      } else {
        // Add reaction
        await socialFeedApi.addReaction(postId, reactionType.toUpperCase());
      }

      // Refresh the specific post or entire feed
      await loadFeedPosts();

    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };

  const toggleExpanded = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card/80">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-16 bg-muted rounded w-full"></div>
                  <div className="flex space-x-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-6 bg-muted rounded w-12"></div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load Feed</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadFeedPosts} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                Y
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your VYBE moment... What's inspiring you today?"
                className="w-full p-3 border border-border/30 rounded-xl resize-none bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 min-h-[80px]"
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{2000 - newPost.length} characters remaining</span>
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim() || isPosting}
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
                >
                  {isPosting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Share VYBE
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="rounded-xl"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </Button>
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your VYBE moment with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => {
            const isExpanded = expandedPosts.has(post.id);
            const shouldTruncate = post.content.length > 280;
            const displayContent = shouldTruncate && !isExpanded
              ? post.content.substring(0, 280) + '...'
              : post.content;

            const ThemeIcon = THEME_ICONS[post.theme as keyof typeof THEME_ICONS] || Heart;

            return (
              <Card key={post.id} className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-200">
                <CardContent className="p-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        {post.author.avatar && !post.isAnonymous ? (
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {post.isAnonymous ? '?' : post.author.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">
                            {post.author.name}
                          </h4>
                          {post.author.isVerified && (
                            <UserCheck className="w-4 h-4 text-primary" />
                          )}
                          {post.author.isCreator && (
                            <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                              Creator
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.timestamp}
                          </span>
                        </div>

                        {post.author.title && (
                          <p className="text-sm text-muted-foreground">{post.author.title}</p>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Theme Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30`}>
                      <ThemeIcon className="w-3 h-3 mr-1" />
                      {post.theme.charAt(0).toUpperCase() + post.theme.slice(1)} Looproom
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {displayContent}
                    </p>
                    {shouldTruncate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(post.id)}
                        className="mt-2 text-primary hover:text-primary/80 p-0 h-auto"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </Button>
                    )}
                  </div>

                  {/* Looproom Connection */}
                  {post.looproom && (
                    <div className="mb-4 p-3 bg-muted/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-foreground">{post.looproom.title}</h5>
                          <p className="text-sm text-muted-foreground">
                            {post.looproom.category} • {post.looproom.participants} participants
                          </p>
                        </div>
                        {post.looproom.isLive && (
                          <div className="flex items-center space-x-1 text-red-600">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">LIVE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reactions Bar */}
                  <div className="flex items-center justify-between py-3 border-t border-border/30">
                    <div className="flex items-center space-x-1">
                      {Object.entries(post.reactions).map(([type, count]) => {
                        if (count === 0) return null;
                        const IconComponent = REACTION_ICONS[type as keyof typeof REACTION_ICONS];
                        const isUserReaction = post.userReacted === type;

                        return (
                          <Button
                            key={type}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReaction(post.id, type)}
                            className={`rounded-full hover:bg-primary/10 ${
                              isUserReaction ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <IconComponent className="w-4 h-4 mr-1" />
                            {count}
                          </Button>
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.stats.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground">
                        <Share className="w-4 h-4 mr-1" />
                        {post.stats.shares}
                      </Button>
                    </div>
                  </div>

                  {/* Comments Preview */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {post.comments.slice(0, 2).map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-2 text-sm">
                          <span className="font-medium text-foreground">{comment.author}:</span>
                          <span className="text-muted-foreground">{comment.content}</span>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto">
                          View all {post.comments.length} comments
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {posts.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              // TODO: Implement pagination
              console.log('Load more posts');
            }}
          >
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;