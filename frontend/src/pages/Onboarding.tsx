import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  Brain,
  Dumbbell,
  Music,
  Palette,
  ArrowRight,
  Check,
  Sparkles,
  Users
} from 'lucide-react';

const LOOPROOM_THEMES = [
  {
    id: 'recovery',
    name: 'Recovery & Healing',
    description: 'Emotional healing, addiction recovery, trauma processing',
    icon: Heart,
    color: 'var(--looproom-recovery)',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    examples: ['Breathwork Sessions', 'Recovery Support', 'Trauma Healing', 'Mindful Recovery']
  },
  {
    id: 'meditation',
    name: 'Meditation & Mindfulness',
    description: 'Guided meditation, mindfulness practices, spiritual growth',
    icon: Brain,
    color: 'var(--looproom-meditation)',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    examples: ['Guided Meditation', 'Mindfulness Training', 'Spiritual Growth', 'Inner Peace']
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    description: 'Physical wellness, workout routines, healthy lifestyle',
    icon: Dumbbell,
    color: 'var(--looproom-fitness)',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-200',
    examples: ['Morning Workouts', 'Yoga Flow', 'Strength Training', 'Wellness Habits']
  },
  {
    id: 'music',
    name: 'Music & Sound',
    description: 'Sound healing, music therapy, creative expression',
    icon: Music,
    color: 'var(--looproom-music)',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-200',
    examples: ['Sound Healing', 'Music Therapy', 'Creative Expression', 'Rhythmic Healing']
  },
  {
    id: 'art',
    name: 'Art & Creativity',
    description: 'Creative expression, art therapy, visual healing',
    icon: Palette,
    color: 'var(--looproom-art)',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    examples: ['Art Therapy', 'Creative Expression', 'Visual Storytelling', 'Healing Arts']
  }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [userType, setUserType] = useState<'member' | 'creator' | ''>('');
  const navigate = useNavigate();

  const progress = (step / 3) * 100;

  const handleThemeToggle = (themeId: string) => {
    setSelectedThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const handleComplete = () => {
    // Store onboarding data
    localStorage.setItem('vybeOnboardingComplete', 'true');
    localStorage.setItem('vybeSelectedThemes', JSON.stringify(selectedThemes));
    localStorage.setItem('vybeUserType', userType);

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to VYBE LOOPROOMS™
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The world's first emotional tech ecosystem. Let's personalize your healing journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            userType === 'member'
              ? 'ring-2 ring-orange-500 bg-orange-50'
              : 'hover:shadow-lg'
          }`}
          onClick={() => setUserType('member')}
        >
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2">I'm here to heal</h3>
            <p className="text-gray-600 text-sm">
              Join looprooms, connect with others, and start your transformation journey
            </p>
            {userType === 'member' && (
              <div className="mt-4">
                <Badge className="bg-orange-500">Selected</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            userType === 'creator'
              ? 'ring-2 ring-purple-500 bg-purple-50'
              : 'hover:shadow-lg'
          }`}
          onClick={() => setUserType('creator')}
        >
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">I'm here to help</h3>
            <p className="text-gray-600 text-sm">
              Create looprooms, guide others, and share your healing expertise
            </p>
            {userType === 'creator' && (
              <div className="mt-4">
                <Badge className="bg-purple-500">Selected</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={!userType}
        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 px-8 py-3"
      >
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Healing Themes
        </h2>
        <p className="text-lg text-gray-600">
          Select the areas where you want to focus your journey. You can always explore more later.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {LOOPROOM_THEMES.map((theme) => {
          const IconComponent = theme.icon;
          const isSelected = selectedThemes.includes(theme.id);

          return (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? `ring-2 ring-opacity-50 ${theme.bgColor} ${theme.borderColor}`
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleThemeToggle(theme.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme.bgColor}`}>
                    <IconComponent className={`w-8 h-8 ${theme.textColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                </div>

                <div className="space-y-2">
                  {theme.examples.slice(0, 3).map((example, index) => (
                    <div key={index} className="text-xs text-gray-500 flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${theme.bgColor.replace('50', '400')}`}></div>
                      {example}
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className="mt-4 text-center">
                    <Badge className={`${theme.textColor} bg-transparent border`}>
                      <Check className="w-3 h-3 mr-1" /> Selected
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={() => setStep(3)}
          disabled={selectedThemes.length === 0}
          className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 px-8 py-3"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          {selectedThemes.length} theme{selectedThemes.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You're All Set!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your personalized VYBE journey. Let's start exploring your selected themes.
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Selected Themes:</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {selectedThemes.map(themeId => {
            const theme = LOOPROOM_THEMES.find(t => t.id === themeId);
            if (!theme) return null;
            const IconComponent = theme.icon;

            return (
              <Badge
                key={themeId}
                className={`${theme.bgColor} ${theme.textColor} px-3 py-2 text-sm border-0`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {theme.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <Button
        onClick={handleComplete}
        className="bg-gradient-to-r from-orange-500 to-purple-600 hover:opacity-90 px-8 py-3 text-lg"
      >
        Enter VYBE Dashboard <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Header */}
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[60vh] flex items-center justify-center">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Back Button */}
        {step > 1 && (
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;