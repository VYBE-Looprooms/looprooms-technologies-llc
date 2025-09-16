import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { looproomApi, categoryApi, type Looproom } from '@/services/api';
import {
  Heart,
  Brain,
  Dumbbell,
  Clock,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PlayCircle,
  Target,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

const THEME_ICONS = {
  recovery: Heart,
  meditation: Brain,
  fitness: Dumbbell
};

const THEME_COLORS = {
  recovery: {
    bg: 'from-red-500/10 to-pink-500/10',
    border: 'border-red-500/20',
    text: 'text-red-600',
    icon: 'text-red-600'
  },
  meditation: {
    bg: 'from-blue-500/10 to-purple-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-600',
    icon: 'text-blue-600'
  },
  fitness: {
    bg: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/20',
    text: 'text-green-600',
    icon: 'text-green-600'
  }
};

const ExploreJourneys: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [featuredJourneys, setFeaturedJourneys] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExploreData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load featured looprooms and categories
        const [looproomsResponse, categoriesResponse] = await Promise.all([
          looproomApi.getAll({
            limit: 6,
            sortBy: 'viewCount',
            sortOrder: 'desc'
          }),
          categoryApi.getAll()
        ]);

        if (looproomsResponse.success && looproomsResponse.data) {
          // Transform looprooms data to featured journeys format
          const transformedJourneys = looproomsResponse.data.map((looproom: Looproom, index: number) => ({
            id: looproom.id,
            title: looproom.title,
            description: looproom.description,
            theme: getThemeFromCategory(looproom.category.slug),
            duration: looproom.duration ? `${looproom.duration} min` : 'Variable',
            steps: Math.floor(Math.random() * 15) + 5, // Mock steps for now
            participants: looproom.viewCount || 0,
            rating: looproom.averageRating || (4.5 + Math.random() * 0.5),
            difficulty: looproom.difficulty || 'All Levels',
            creator: looproom.creator.name,
            preview: looproom.description.substring(0, 80) + '...',
            isPopular: index < 2,
            isNew: index >= 2 && index < 4,
            tags: looproom.tags.map(tag => tag.name).slice(0, 3)
          }));
          setFeaturedJourneys(transformedJourneys);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

      } catch (err) {
        console.error('Error loading explore data:', err);
        setError('Failed to load journey data. Please try again.');

        // Fallback to mock data
        setFeaturedJourneys([
          {
            id: 'recovery-fundamentals',
            title: 'Recovery Fundamentals',
            description: 'Essential practices for emotional healing and personal growth',
            theme: 'recovery',
            duration: '7 days',
            steps: 12,
            participants: 1247,
            rating: 4.8,
            difficulty: 'Beginner',
            creator: 'Dr. Sarah Chen',
            preview: 'Start with morning reflections and build sustainable habits',
            isPopular: true,
            tags: ['Healing', 'Daily Practice', 'Support']
          },
          {
            id: 'mindful-body',
            title: 'Mindful Body Connection',
            description: 'Unite physical awareness with mental clarity through guided practices',
            theme: 'meditation',
            duration: '5 days',
            steps: 8,
            participants: 892,
            rating: 4.9,
            difficulty: 'Intermediate',
            creator: 'Master Alex Kim',
            preview: 'Body scan meditations and awareness exercises',
            isNew: true,
            tags: ['Body Awareness', 'Meditation', 'Balance']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadExploreData();
  }, []);

  // Navigation handlers
  const handleStartFreeJourney = () => {
    // Navigate to the first available journey/looproom in recovery category
    if (featuredJourneys.length > 0) {
      const firstJourney = featuredJourneys[0];
      navigate(`/looproom/${firstJourney.id}`);
    } else {
      // If no featured journeys, go to recovery category
      navigate('/explore/recovery');
    }
  };

  const handleBrowseAllPaths = () => {
    // Navigate to comprehensive looprooms/journeys view
    navigate('/looprooms');
  };

  const handleStartJourney = (looproomId: string) => {
    navigate(`/looproom/${looproomId}`);
  };

  const handlePreviewJourney = (looproomId: string) => {
    navigate(`/looproom/${looproomId}?preview=true`);
  };

  const handleFeaturedPathStart = (pathId: string) => {
    // For featured paths, we'll use the first looproom in the category
    navigate(`/loopchain/${pathId}`);
  };

  const handleFollowLoopchain = (chainId: string) => {
    navigate(`/loopchain/${chainId}`);
  };

  // Helper function to map category to theme
  const getThemeFromCategory = (categorySlug: string): 'recovery' | 'meditation' | 'fitness' => {
    if (categorySlug.includes('recovery') || categorySlug.includes('support')) return 'recovery';
    if (categorySlug.includes('meditation') || categorySlug.includes('mindful')) return 'meditation';
    if (categorySlug.includes('fitness') || categorySlug.includes('movement')) return 'fitness';
    return 'recovery'; // default
  };

  const quickStartPaths = [
    {
      id: 'morning-reset-meditation',
      title: '5-Minute Morning Reset',
      theme: 'meditation',
      duration: '5 min',
      participants: 2341
    },
    {
      id: 'gratitude-recovery',
      title: 'Gratitude Practice',
      theme: 'recovery',
      duration: '3 min',
      participants: 1876
    },
    {
      id: 'desk-warrior-fitness',
      title: 'Desk Warrior Stretch',
      theme: 'fitness',
      duration: '7 min',
      participants: 1543
    }
  ];

  const popularLoopchains = [
    {
      id: 'recovery-meditation-fitness',
      title: 'Recovery → Meditation → Fitness',
      description: 'Complete transformation journey',
      steps: 21,
      duration: '3 weeks',
      completions: 456
    },
    {
      id: 'morning-ritual-path',
      title: 'Morning Ritual Path',
      description: 'Start each day with intention',
      steps: 7,
      duration: '1 week',
      completions: 1203
    },
    {
      id: 'stress-relief-circuit',
      title: 'Stress Relief Circuit',
      description: 'Break the cycle of overwhelm',
      steps: 14,
      duration: '2 weeks',
      completions: 734
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Journeys', count: featuredJourneys.length },
    { id: 'recovery', label: 'Recovery', count: featuredJourneys.filter(j => j.theme === 'recovery').length },
    { id: 'meditation', label: 'Meditation', count: featuredJourneys.filter(j => j.theme === 'meditation').length },
    { id: 'fitness', label: 'Fitness', count: featuredJourneys.filter(j => j.theme === 'fitness').length }
  ];

  const filteredJourneys = selectedFilter === 'all'
    ? featuredJourneys
    : featuredJourneys.filter(journey => journey.theme === selectedFilter);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="bg-card/80">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-2xl mx-auto"></div>
              <div className="h-8 bg-muted rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="flex justify-center gap-4">
                <div className="h-10 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardContent className="p-4">
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded w-20"></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-muted/50 rounded-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-muted rounded-2xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
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
            <h3 className="text-xl font-semibold mb-2 text-foreground">Unable to Load Journeys</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Your Healing Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Discover guided paths designed to support your emotional, mental, and physical wellbeing. Each journey is crafted by experienced healers and backed by our community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleStartFreeJourney}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-primary-foreground shadow-lg"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Free Journey
              </Button>
              <Button
                onClick={handleBrowseAllPaths}
                variant="outline"
                className="rounded-xl border-2 hover:bg-muted/50"
              >
                Browse All Paths
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                className={`rounded-xl transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
                <Badge className="ml-2 bg-white/20 text-inherit border-white/30">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Section */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-4 h-4 text-primary-foreground" />
            </div>
            Quick Start (5 minutes or less)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickStartPaths.map((path, index) => {
              const IconComponent = THEME_ICONS[path.theme as keyof typeof THEME_ICONS];
              const colors = THEME_COLORS[path.theme as keyof typeof THEME_COLORS];

              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-card/50 border-border/30 group">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${colors.bg} rounded-xl mx-auto mb-3 flex items-center justify-center border ${colors.border}`}>
                        <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{path.title}</h4>
                      <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {path.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {path.participants.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleFeaturedPathStart(path.id)}
                        className={`w-full rounded-lg ${colors.text} border-2 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-transparent transition-all duration-200`}
                        variant="outline"
                      >
                        Start Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Featured Journeys */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-primary-foreground" />
            </div>
            Featured Journeys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredJourneys.map((journey, index) => {
            const IconComponent = THEME_ICONS[journey.theme as keyof typeof THEME_ICONS];
            const colors = THEME_COLORS[journey.theme as keyof typeof THEME_COLORS];

            return (
              <Card key={journey.id} className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-card/50 border-border/30 group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Journey Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-r ${colors.bg} rounded-2xl flex items-center justify-center border ${colors.border} group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-xl text-foreground">{journey.title}</h3>
                            {journey.isPopular && (
                              <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30 text-xs">
                                🔥 Popular
                              </Badge>
                            )}
                            {journey.isNew && (
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                                ✨ New
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{journey.description}</p>
                          <p className="text-sm text-foreground/80 italic">"{journey.preview}"</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-foreground">{journey.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">by {journey.creator}</p>
                      </div>
                    </div>

                    {/* Journey Stats */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {journey.duration}
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {journey.steps} steps
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {journey.participants.toLocaleString()} joined
                      </span>
                      <Badge className={`${colors.text} bg-transparent border ${colors.border}`}>
                        {journey.difficulty}
                      </Badge>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {journey.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs bg-muted/50 text-muted-foreground hover:bg-muted/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewJourney(journey.id)}
                        className="rounded-lg border-2 hover:bg-muted/50"
                      >
                        Preview Journey
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleStartJourney(journey.id)}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-lg text-primary-foreground shadow-lg"
                      >
                        Start Journey
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Popular Loopchains */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            Popular Loopchains
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {popularLoopchains.map((chain, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl cursor-pointer transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{chain.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {chain.description} • {chain.steps} steps • {chain.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm">
                  <p className="font-semibold text-foreground">{chain.completions}</p>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFollowLoopchain(chain.id)}
                  className="rounded-lg"
                >
                  Follow Path
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExploreJourneys;