import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Heart, 
  Sprout, 
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react';

export interface VYBEReaction {
  id: string;
  type: 'progress' | 'inspired' | 'growth' | 'breakthrough';
  count: number;
  userReacted: boolean;
}

interface VYBEReactionsProps {
  reactions: VYBEReaction[];
  onReact: (type: VYBEReaction['type']) => void;
  vybeScore: number;
  impactCount: number;
}

const VYBEReactions: React.FC<VYBEReactionsProps> = ({ 
  reactions, 
  onReact, 
  vybeScore, 
  impactCount 
}) => {
  const reactionConfig = {
    progress: {
      icon: Flame,
      label: 'Progress',
      color: 'text-vybe-primary',
      bgColor: 'bg-vybe-primary/10 dark:bg-vybe-primary/20',
      hoverColor: 'hover:text-vybe-primary',
      emoji: '🔥'
    },
    inspired: {
      icon: Heart,
      label: 'Inspired Me',
      color: 'text-vybe-accent',
      bgColor: 'bg-vybe-accent/10 dark:bg-vybe-accent/20',
      hoverColor: 'hover:text-vybe-accent',
      emoji: '💜'
    },
    growth: {
      icon: Sprout,
      label: 'Growth',
      color: 'text-vybe-secondary',
      bgColor: 'bg-vybe-secondary/10 dark:bg-vybe-secondary/20',
      hoverColor: 'hover:text-vybe-secondary',
      emoji: '🌱'
    },
    breakthrough: {
      icon: Sparkles,
      label: 'Breakthrough',
      color: 'text-vybe-primary',
      bgColor: 'bg-vybe-primary/10 dark:bg-vybe-primary/20',
      hoverColor: 'hover:text-vybe-primary',
      emoji: '✨'
    }
  };

  return (
    <div className="space-y-3">
      {/* VYBE Meter */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-vybe-primary/10 to-vybe-secondary/10 rounded-lg border border-vybe-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-vybe-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-vybe-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-vybe-primary">VYBE Score</div>
            <div className="text-xs text-muted-foreground">Positive Impact</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-vybe-primary">{vybeScore}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {impactCount} inspired
          </div>
        </div>
      </div>

      {/* Reaction Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {reactions.map((reaction) => {
          const config = reactionConfig[reaction.type];
          const Icon = config.icon;
          
          return (
            <Button
              key={reaction.type}
              variant="ghost"
              size="sm"
              onClick={() => onReact(reaction.type)}
              className={`flex items-center justify-center gap-2 h-12 transition-all ${
                reaction.userReacted 
                  ? `${config.color} ${config.bgColor}` 
                  : `text-muted-foreground ${config.hoverColor}`
              }`}
            >
              <span className="text-base">{config.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium">{config.label}</span>
                <span className="text-xs opacity-70">{reaction.count}</span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Reaction Summary */}
      <div className="flex flex-wrap gap-1">
        {reactions
          .filter(r => r.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((reaction) => {
            const config = reactionConfig[reaction.type];
            return (
              <Badge 
                key={reaction.type}
                variant="secondary" 
                className={`text-xs ${config.color} ${config.bgColor}`}
              >
                {config.emoji} {reaction.count}
              </Badge>
            );
          })}
      </div>
    </div>
  );
};

export default VYBEReactions;