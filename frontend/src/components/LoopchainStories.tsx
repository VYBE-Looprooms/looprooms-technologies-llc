import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link2, 
  ArrowRight, 
  Zap, 
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';

export interface LoopchainConnection {
  id: string;
  fromPostId: string;
  toPostId: string;
  connectionType: 'inspired' | 'followed' | 'adapted' | 'transformed';
  strength: number; // 1-5
}

export interface RippleEffect {
  id: string;
  originPostId: string;
  impactRadius: number;
  inspirationCount: number;
  actionsTaken: number;
  communities: string[];
}

interface LoopchainStoriesProps {
  connections: LoopchainConnection[];
  rippleEffect?: RippleEffect;
  isConnected: boolean;
  onExploreChain: () => void;
}

const LoopchainStories: React.FC<LoopchainStoriesProps> = ({
  connections,
  rippleEffect,
  isConnected,
  onExploreChain
}) => {
  const connectionConfig = {
    inspired: { 
      label: 'Inspired by this',
      color: 'text-vybe-accent',
      bgColor: 'bg-vybe-accent/10 dark:bg-vybe-accent/20',
      icon: Sparkles
    },
    followed: { 
      label: 'Followed this path',
      color: 'text-vybe-primary',
      bgColor: 'bg-vybe-primary/10 dark:bg-vybe-primary/20',
      icon: ArrowRight
    },
    adapted: { 
      label: 'Adapted approach',
      color: 'text-vybe-secondary',
      bgColor: 'bg-vybe-secondary/10 dark:bg-vybe-secondary/20',
      icon: Zap
    },
    transformed: { 
      label: 'Transformed journey',
      color: 'text-vybe-primary',
      bgColor: 'bg-vybe-primary/10 dark:bg-vybe-primary/20',
      icon: TrendingUp
    }
  };

  if (!isConnected && (!connections || connections.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Loopchain Connections */}
      {connections && connections.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Link2 className="w-4 h-4 text-vybe-primary" />
          <span className="text-muted-foreground">Connected to transformation chain</span>
        </div>
      )}

      {/* Connection Types */}
      {connections && connections.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(() => {
            const connectionCounts = connections.reduce((acc, connection) => {
              acc[connection.connectionType] = (acc[connection.connectionType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return Object.entries(connectionCounts).map(([type, count]) => {
              const config = connectionConfig[type as keyof typeof connectionConfig];
              const Icon = config?.icon || Link2;
              
              return (
                <Badge 
                  key={type}
                  variant="outline" 
                  className={`${config?.color || 'text-vybe-primary'} ${config?.bgColor || 'bg-vybe-primary/10'} flex items-center gap-1`}
                >
                  <Icon className="w-3 h-3" />
                  {config?.label || type}
                  {count > 1 && <span className="ml-1">({count})</span>}
                </Badge>
              );
            });
          })()}
        </div>
      )}

      {/* Ripple Effect */}
      {rippleEffect && rippleEffect.impactRadius > 0 && (
        <Card className="bg-gradient-to-r from-vybe-accent/10 to-vybe-secondary/10 dark:from-vybe-accent/20 dark:to-vybe-secondary/20 border-vybe-accent/30 dark:border-vybe-accent/40">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-vybe-accent/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-vybe-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-vybe-accent dark:text-vybe-accent">
                    Ripple Effect
                  </span>
                  <Badge variant="outline" className="text-xs bg-vybe-accent/10 text-vybe-accent border-vybe-accent/30">
                    Active Impact
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Your story is creating waves of change</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-vybe-accent">{rippleEffect.inspirationCount}</div>
                <div className="text-xs text-muted-foreground">People Inspired</div>
              </div>
              <div>
                <div className="text-lg font-bold text-vybe-accent">{rippleEffect.actionsTaken}</div>
                <div className="text-xs text-muted-foreground">Actions Taken</div>
              </div>
              <div>
                <div className="text-lg font-bold text-vybe-accent">{rippleEffect.communities.length}</div>
                <div className="text-xs text-muted-foreground">Communities</div>
              </div>
            </div>

            {rippleEffect.communities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-vybe-accent/20">
                <div className="text-xs text-muted-foreground mb-2">Impact Spreading In:</div>
                <div className="flex flex-wrap gap-1">
                  {rippleEffect.communities.slice(0, 3).map((community, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-vybe-accent/10 text-vybe-accent border-vybe-accent/30">
                      {community}
                    </Badge>
                  ))}
                  {rippleEffect.communities.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-vybe-accent/10 text-vybe-accent border-vybe-accent/30">
                      +{rippleEffect.communities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Explore Chain Button */}
      {(connections && connections.length > 0) && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onExploreChain}
          className="w-full border-vybe-primary/30 text-vybe-primary hover:bg-vybe-primary/10"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Explore Transformation Chain
        </Button>
      )}
    </div>
  );
};

export default LoopchainStories;