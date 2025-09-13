import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Award,
  Heart,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export interface CreatorSpotlight {
  id: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    isVerified: boolean;
  };
  impactMetrics: {
    storiesInspired: number;
    totalReach: number;
    transformationRate: number; // percentage
    vybeScore: number;
  };
  featuredStory: {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    reactions: number;
  };
  trending: boolean;
}

export interface WeeklyImpactSummary {
  userId: string;
  weekStart: string;
  metrics: {
    storiesShared: number;
    peopleInspired: number;
    reactionsReceived: number;
    chainConnections: number;
    topCategory: string;
    impactRadius: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    type: 'milestone' | 'impact' | 'growth' | 'connection';
    earned: boolean;
  }[];
  rippleMap: {
    yourPost: string;
    inspired: {
      userId: string;
      action: string;
      looproom: string;
    }[];
  }[];
}

interface CreatorSpotlightProps {
  spotlights: CreatorSpotlight[];
  onViewCreator: (creatorId: string) => void;
}

interface WeeklyReflectionProps {
  summary: WeeklyImpactSummary;
  onViewFullReport: () => void;
}

export const CreatorSpotlightCard: React.FC<CreatorSpotlightProps> = ({ 
  spotlights, 
  onViewCreator 
}) => {
  const topCreator = spotlights.find(c => c.trending) || spotlights[0];
  
  if (!topCreator) return null;

  return (
    <Card className="bg-gradient-to-br from-vybe-secondary/10 to-vybe-accent/10 dark:from-vybe-secondary/20 dark:to-vybe-accent/20 border-vybe-secondary/30 dark:border-vybe-secondary/40">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-vybe-secondary dark:text-vybe-secondary">
          <Star className="w-5 h-5 text-vybe-accent" />
          Creator Spotlight
          {topCreator.trending && (
            <Badge variant="outline" className="text-xs bg-vybe-accent/10 text-vybe-accent border-vybe-accent/30">
              Trending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Creator Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {topCreator.creator.avatar ? (
              <AvatarImage src={topCreator.creator.avatar} alt={topCreator.creator.name} />
            ) : (
              <AvatarFallback className="bg-vybe-secondary/10 text-vybe-secondary">
                {topCreator.creator.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground">{topCreator.creator.name}</h4>
              {topCreator.creator.isVerified && (
                <Award className="w-4 h-4 text-vybe-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{topCreator.creator.title}</p>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-vybe-secondary">{topCreator.impactMetrics.storiesInspired}</div>
            <div className="text-xs text-muted-foreground">Stories Inspired</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-vybe-secondary">{topCreator.impactMetrics.vybeScore}</div>
            <div className="text-xs text-muted-foreground">VYBE Score</div>
          </div>
        </div>

        {/* Transformation Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transformation Impact</span>
            <span className="font-medium text-vybe-secondary">{topCreator.impactMetrics.transformationRate}%</span>
          </div>
          <Progress 
            value={topCreator.impactMetrics.transformationRate} 
            className="h-2 bg-vybe-secondary/20"
          />
        </div>

        {/* Featured Story */}
        <div className="p-3 bg-white/70 dark:bg-black/30 rounded-lg border border-vybe-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs bg-vybe-secondary/10 text-vybe-secondary border-vybe-secondary/30">
              {topCreator.featuredStory.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {topCreator.featuredStory.reactions}
            </div>
          </div>
          <h5 className="font-medium text-sm mb-1">{topCreator.featuredStory.title}</h5>
          <p className="text-xs text-muted-foreground line-clamp-2">{topCreator.featuredStory.excerpt}</p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewCreator(topCreator.creator.id)}
          className="w-full text-vybe-secondary border-vybe-secondary/30 hover:bg-vybe-secondary/10"
        >
          View Looprooms
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export const WeeklyReflectionCard: React.FC<WeeklyReflectionProps> = ({ 
  summary, 
  onViewFullReport 
}) => {
  const hasImpact = summary.metrics.peopleInspired > 0;

  return (
    <Card className="bg-gradient-to-br from-vybe-primary/10 to-vybe-accent/10 border-vybe-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-vybe-primary">
          <Sparkles className="w-5 h-5 text-vybe-accent" />
          Your Week's Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hero Impact */}
        {hasImpact && (
          <div className="text-center p-4 bg-gradient-to-r from-vybe-primary/10 to-vybe-accent/10 rounded-lg">
            <div className="text-2xl font-bold text-vybe-primary mb-1">
              {summary.metrics.peopleInspired}
            </div>
            <div className="text-sm text-vybe-secondary font-medium">
              people inspired by your stories
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              You're making a difference! 🌟
            </div>
          </div>
        )}

        {/* Impact Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-vybe-primary">{summary.metrics.storiesShared}</div>
            <div className="text-xs text-muted-foreground">Stories Shared</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="text-lg font-bold text-vybe-primary">{summary.metrics.chainConnections}</div>
            <div className="text-xs text-muted-foreground">Chain Connections</div>
          </div>
        </div>

        {/* Top Category */}
        <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-black/30 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-vybe-accent" />
            <span className="text-sm font-medium">Top Category</span>
          </div>
          <Badge variant="outline" className="text-vybe-primary border-vybe-primary/30 bg-vybe-primary/10">
            {summary.metrics.topCategory}
          </Badge>
        </div>

        {/* Recent Achievements */}
        {summary.achievements.filter(a => a.earned).length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">New Achievements</h5>
            {summary.achievements
              .filter(a => a.earned)
              .slice(0, 2)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2 p-2 bg-vybe-accent/10 rounded-lg border border-vybe-accent/20">
                  <Award className="w-4 h-4 text-vybe-accent" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-vybe-secondary">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-vybe-secondary/70">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Ripple Effect Preview */}
        {summary.rippleMap.length > 0 && (
          <div className="p-3 bg-vybe-primary/10 rounded-lg border border-vybe-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-vybe-primary" />
              <span className="text-sm font-medium text-vybe-secondary">
                Ripple Effect
              </span>
            </div>
            <p className="text-xs text-vybe-secondary/80">
              Your "{summary.rippleMap[0].yourPost}" story led {summary.rippleMap[0].inspired.length} people to join new Looprooms
            </p>
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewFullReport}
          className="w-full text-vybe-primary border-vybe-primary/30 hover:bg-vybe-primary/10"
        >
          View Full Impact Report
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};