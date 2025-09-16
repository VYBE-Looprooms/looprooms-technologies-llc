import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Circle,
  Clock,
  Users,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LoopchainStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  looproom: {
    id: string;
    title: string;
    duration: number;
    thumbnail?: string;
  };
  isOptional: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  minCompletionTime?: number;
  requiresInteraction: boolean;
}

interface Loopchain {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
  category: string;
  estimatedDuration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string[];
  enrollmentCount: number;
  completionCount: number;
  averageRating: number;
  steps: LoopchainStep[];
  userProgress?: {
    currentStep: number;
    completedSteps: number;
    progressPercent: number;
    isEnrolled: boolean;
    startedAt?: Date;
    completedAt?: Date;
  };
}

const mockLoopchain: Loopchain = {
  id: '1',
  title: '21-Day Mindfulness Journey',
  description: 'A comprehensive meditation program designed to build a sustainable mindfulness practice. Learn foundational techniques, develop daily habits, and discover inner peace through guided sessions.',
  thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  creator: {
    id: 'creator-1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=100&h=100&fit=crop&crop=faces',
    isVerified: true
  },
  category: 'Meditation',
  estimatedDuration: 420, // 7 hours total
  difficulty: 'Beginner',
  goals: ['Build daily meditation habit', 'Reduce stress and anxiety', 'Improve focus and clarity', 'Develop emotional awareness'],
  enrollmentCount: 2847,
  completionCount: 1923,
  averageRating: 4.8,
  userProgress: {
    currentStep: 5,
    completedSteps: 4,
    progressPercent: 19,
    isEnrolled: true,
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
  },
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Welcome & Foundation',
      description: 'Introduction to mindfulness and setting up your practice space',
      looproom: {
        id: 'looproom-1',
        title: 'Mindfulness Foundations',
        duration: 15
      },
      isOptional: false,
      isCompleted: true,
      isLocked: false,
      requiresInteraction: true
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Breath Awareness',
      description: 'Learn basic breathing techniques for meditation',
      looproom: {
        id: 'looproom-2',
        title: 'Breathing Basics',
        duration: 20
      },
      isOptional: false,
      isCompleted: true,
      isLocked: false,
      requiresInteraction: true
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Body Scan Meditation',
      description: 'Develop body awareness through guided body scan practice',
      looproom: {
        id: 'looproom-3',
        title: 'Full Body Awareness',
        duration: 25
      },
      isOptional: false,
      isCompleted: true,
      isLocked: false,
      requiresInteraction: true
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Dealing with Thoughts',
      description: 'Learn how to observe thoughts without judgment',
      looproom: {
        id: 'looproom-4',
        title: 'Thought Observation',
        duration: 20
      },
      isOptional: false,
      isCompleted: true,
      isLocked: false,
      requiresInteraction: true
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Loving-Kindness Practice',
      description: 'Cultivate compassion for yourself and others',
      looproom: {
        id: 'looproom-5',
        title: 'Loving-Kindness Meditation',
        duration: 20
      },
      isOptional: false,
      isCompleted: false,
      isLocked: false,
      requiresInteraction: true
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Walking Meditation',
      description: 'Practice mindfulness in movement',
      looproom: {
        id: 'looproom-6',
        title: 'Mindful Walking',
        duration: 15
      },
      isOptional: true,
      isCompleted: false,
      isLocked: false,
      requiresInteraction: false
    }
  ]
};

const LoopchainViewer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loopchain, setLoopchain] = useState<Loopchain>(mockLoopchain);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (loopchain.userProgress?.isEnrolled) return;

    setLoading(true);
    try {
      // TODO: Implement actual enrollment API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoopchain(prev => ({
        ...prev,
        userProgress: {
          currentStep: 1,
          completedSteps: 0,
          progressPercent: 0,
          isEnrolled: true,
          startedAt: new Date()
        }
      }));
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (step: LoopchainStep) => {
    if (step.isLocked) return;
    navigate(`/looproom/${step.looproom.id}?loopchain=${loopchain.id}&step=${step.stepNumber}`);
  };

  const handleContinue = () => {
    const nextStep = loopchain.steps.find(step => !step.isCompleted && !step.isLocked);
    if (nextStep) {
      handleStepClick(nextStep);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const completionRate = Math.round((loopchain.completionCount / loopchain.enrollmentCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-foreground">Loopchain Journey</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl overflow-hidden">
              <div className="aspect-video relative">
                {loopchain.thumbnail ? (
                  <img
                    src={loopchain.thumbnail}
                    alt={loopchain.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                      {loopchain.category}
                    </span>
                    <span className="px-3 py-1 bg-black/50 text-white text-sm font-medium rounded-full">
                      {loopchain.difficulty}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">{loopchain.title}</h1>
                  <div className="flex items-center space-x-4 text-white/80 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(loopchain.estimatedDuration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{loopchain.enrollmentCount.toLocaleString()} enrolled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{loopchain.averageRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Enrolled Users */}
              {loopchain.userProgress?.isEnrolled && (
                <div className="p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Progress: {loopchain.userProgress.completedSteps} of {loopchain.steps.length} steps
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {loopchain.userProgress.progressPercent}%
                    </span>
                  </div>
                  <Progress value={loopchain.userProgress.progressPercent} className="h-2" />
                </div>
              )}
            </Card>

            {/* Description & Goals */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">About This Journey</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{loopchain.description}</p>

                <h3 className="text-lg font-semibold text-foreground mb-3">What You'll Achieve</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loopchain.goals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Journey Steps</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({loopchain.steps.length} steps)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loopchain.steps.map((step, index) => (
                  <div
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      step.isLocked
                        ? 'border-border bg-muted/20 cursor-not-allowed opacity-60'
                        : step.isCompleted
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 cursor-pointer hover:border-green-300'
                        : loopchain.userProgress?.currentStep === step.stepNumber
                        ? 'border-primary bg-primary/10 cursor-pointer hover:border-primary/60'
                        : 'border-border hover:border-border/60 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                        {step.isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : step.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : loopchain.userProgress?.currentStep === step.stepNumber ? (
                          <Play className="w-4 h-4 text-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">
                              {step.stepNumber}. {step.title}
                            </h4>
                            {step.isOptional && (
                              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                                Optional
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{step.looproom.duration}m</span>
                            {!step.isLocked && <ChevronRight className="w-4 h-4" />}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                        <p className="text-sm font-medium text-primary mt-2">{step.looproom.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardContent className="p-6">
                {loopchain.userProgress?.isEnrolled ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Your Progress</h3>
                      <div className="text-3xl font-bold text-primary mb-1">
                        {loopchain.userProgress.progressPercent}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {loopchain.userProgress.completedSteps} of {loopchain.steps.length} steps completed
                      </p>
                    </div>

                    <Button
                      onClick={handleContinue}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continue Journey
                    </Button>

                    {loopchain.userProgress.startedAt && (
                      <p className="text-xs text-muted-foreground text-center">
                        Started {loopchain.userProgress.startedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-semibold text-foreground">Ready to start?</h3>
                    <p className="text-sm text-muted-foreground">
                      Join {loopchain.enrollmentCount.toLocaleString()} others on this transformative journey
                    </p>
                    <Button
                      onClick={handleEnroll}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl"
                    >
                      {loading ? 'Enrolling...' : 'Start Journey'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Created by</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    {loopchain.creator.avatar ? (
                      <AvatarImage src={loopchain.creator.avatar} alt={loopchain.creator.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {loopchain.creator.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{loopchain.creator.name}</h4>
                      {loopchain.creator.isVerified && (
                        <Award className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">Verified Creator</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full rounded-xl">
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Journey Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Enrolled</span>
                  <span className="font-medium text-foreground">{loopchain.enrollmentCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium text-foreground">{loopchain.completionCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-foreground">{completionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span className="font-medium text-foreground">{loopchain.averageRating}</span>
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

export default LoopchainViewer;