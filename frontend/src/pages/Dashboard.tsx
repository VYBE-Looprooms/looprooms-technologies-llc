import { FormEvent, useEffect, useMemo, useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import {
  listLooprooms,
  recommendLooproom,
  type LooproomDetail,
  type MoodRecommendationResponse,
} from '@/services/looprooms';
import { fetchReactionPresets, fetchMotivationalMessages } from '@/services/engagement';
import type { ReactionPreset, MotivationalMessage } from '@/services/engagement';
import { Sparkles, HeartPulse, Waves, Flame, Apple, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const moodOptions: Array<{
  key: string;
  label: string;
  description: string;
  gradient: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    key: 'calm',
    label: 'Calm & Centered',
    description: 'Craving guided breathwork and soft grounding.',
    gradient: 'from-vybe-cyan to-sky-500',
    icon: Waves,
  },
  {
    key: 'anxious',
    label: 'Anxious & Overwhelmed',
    description: 'Need recovery anchors and compassionate space.',
    gradient: 'from-blue-500 to-vybe-purple',
    icon: HeartPulse,
  },
  {
    key: 'energized',
    label: 'Energized & Ready',
    description: 'Ready to move, sweat, and hype the crew.',
    gradient: 'from-fuchsia-500 to-vybe-pink',
    icon: Flame,
  },
  {
    key: 'drained',
    label: 'Drained & Heavy',
    description: 'Looking for restorative reset rituals.',
    gradient: 'from-vybe-purple to-indigo-500',
    icon: Sparkles,
  },
  {
    key: 'curious',
    label: 'Curious & Inspired',
    description: 'Hungry for mindful nutrition and creative flow.',
    gradient: 'from-amber-400 to-vybe-pink',
    icon: Apple,
  },
  {
    key: 'lonely',
    label: 'Seeking Support',
    description: 'Want to share space with recovery allies.',
    gradient: 'from-sky-500 to-blue-500',
    icon: Compass,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState('');
  const [recommendation, setRecommendation] = useState<MoodRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const looproomsQuery = useQuery({
    queryKey: ['looprooms'],
    queryFn: listLooprooms,
  });

  const reactionPresetsQuery = useQuery({
    queryKey: ['reaction-presets'],
    queryFn: fetchReactionPresets,
  });

  const motivationalMessagesQuery = useQuery({
    queryKey: ['motivational-messages'],
    queryFn: fetchMotivationalMessages,
  });

  const moodMutation = useMutation({
    mutationFn: recommendLooproom,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setRecommendation(response.data);
        setError(null);
      } else {
        setError(response.message || 'Unable to generate a recommendation.');
      }
    },
    onError: (mutationError) => {
      console.error('[VYBE] Mood recommendation error', mutationError);
      setError('Unable to generate a recommendation right now. Please try again.');
    },
  });

  const looprooms = useMemo<LooproomDetail[]>(() => looproomsQuery.data?.data ?? [], [looproomsQuery.data]);
  const reactionPresets = useMemo<ReactionPreset[]>(
    () => reactionPresetsQuery.data?.data ?? [],
    [reactionPresetsQuery.data]
  );
  const motivationalMessages = useMemo<MotivationalMessage[]>(
    () => motivationalMessagesQuery.data?.data ?? [],
    [motivationalMessagesQuery.data]
  );

  const topMotivations = useMemo(() => motivationalMessages.slice(0, 3), [motivationalMessages]);

  const handleEnterLooproom = (slug: string) => {
    navigate(`/looprooms/${slug}`);
  };

  const handleSelectMood = (moodKey: string) => {
    setSelectedMood(moodKey);
    setCustomMood('');
    moodMutation.mutate({ moodKey });
  };

  const handleCustomMood = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customMood.trim()) {
      toast({
        title: 'Share a few words first',
        description: 'Let us know how you feel or pick a preset mood.',
      });
      return;
    }

    setSelectedMood(null);
    moodMutation.mutate({ moodText: customMood.trim() });
  };

  const isLoading =
    looproomsQuery.isLoading || reactionPresetsQuery.isLoading || motivationalMessagesQuery.isLoading;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-32 flex items-center justify-center">
          <p className="text-foreground/60">Redirecting you to sign in...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <section className="w-full px-4 sm:px-6 lg:px-12">
          <div className="w-full space-y-12">
            <header className="vybe-card border-glow p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-wider text-foreground/50">Loopchain Navigator</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                    Hey {user.firstName || user.email}, let&apos;s tune your vibe
                  </h1>
                  <p className="text-foreground/70 max-w-2xl">
                    Choose how you feel or share it in your own words. We&apos;ll guide you into the right looproom, map
                    the next loopchain steps, and highlight the overlays that keep our community so supportive.
                  </p>
                </div>
                <div className="vybe-pill text-sm bg-gradient-to-br from-vybe-cyan/20 via-vybe-purple/20 to-vybe-pink/20 text-foreground/80">
                  <span className="font-semibold text-gradient">5 core themes</span>
                  <span className="mx-2">•</span>
                  <span>Recovery • Meditation • Fitness • Wellness • Nourish</span>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-[2.2fr,1fr] gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="vybe-card border-glow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gradient">How are you arriving today?</h2>
                    <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                      Mood presets + custom check-in
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {moodOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = selectedMood === option.key;
                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => handleSelectMood(option.key)}
                          className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 text-left p-5 focus:outline-none focus:ring-2 focus:ring-vybe-cyan/60 ${
                            isActive
                              ? 'border-vybe-cyan/70 shadow-lg shadow-vybe-cyan/20'
                              : 'border-white/10 hover:border-vybe-cyan/50 hover:shadow-lg hover:shadow-vybe-cyan/10'
                          }`}
                        >
                          <div className={`absolute inset-0 opacity-70 bg-gradient-to-br ${option.gradient}`}></div>
                          <div className="relative flex flex-col gap-2 text-white">
                            <Icon className="w-8 h-8" />
                            <h3 className="text-lg font-semibold">{option.label}</h3>
                            <p className="text-sm text-white/80">{option.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <form className="mt-6 space-y-3" onSubmit={handleCustomMood}>
                    <label className="text-sm font-medium text-foreground/80" htmlFor="customMood">
                      Or describe your vibe in your own words
                    </label>
                    <Textarea
                      id="customMood"
                      value={customMood}
                      onChange={(event) => setCustomMood(event.target.value)}
                      placeholder="Example: I feel scattered after a long shift and need gentle accountability."
                      className="resize-none h-24"
                    />
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button type="submit" className="btn-glow" disabled={moodMutation.isPending}>
                        {moodMutation.isPending ? 'Mapping your loopchain...' : 'Tune my vibe'}
                      </Button>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                  </form>
                </div>

                <div className="vybe-card border-glow p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-gradient">Recommended journey</h2>
                      <p className="text-foreground/60">
                        We surface the best looproom plus the next steps in your loopchain with uplifting alternatives.
                      </p>
                    </div>
                    <Badge className="bg-vybe-purple/20 text-vybe-purple">AI mood map</Badge>
                  </div>

                  {moodMutation.isPending && (
                    <div className="space-y-3">
                      <Skeleton className="h-24 rounded-xl bg-white/5" />
                      <Skeleton className="h-10 rounded-xl bg-white/5" />
                      <Skeleton className="h-32 rounded-xl bg-white/5" />
                    </div>
                  )}

                  {!moodMutation.isPending && recommendation && (
                    <div className="space-y-6">
                      <div className="border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-vybe-cyan/30 to-transparent p-6">
                          <p className="text-xs uppercase tracking-wider text-foreground/60">Primary recommendation</p>
                          <h3 className="text-3xl font-semibold text-gradient mt-2">
                            {recommendation.recommended.title}
                          </h3>
                          <p className="text-foreground/70 mt-3 max-w-2xl">
                            {recommendation.recommended.summary || recommendation.recommended.description}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-4">
                            {recommendation.recommended.category && (
                              <Badge className="bg-white/10 text-foreground/90 border border-white/10">
                                {recommendation.recommended.category.name}
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                              Mood matched: {recommendation.mood.resolvedKey}
                            </Badge>
                            {recommendation.mood.moodText && (
                              <Badge variant="outline" className="border-vybe-purple/40 text-foreground/70">
                                Your words: “{recommendation.mood.moodText}”
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-6 space-y-4 bg-background/60">
                          <p className="text-sm font-medium text-foreground/70">Loopchain momentum</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button
                              size="sm"
                              className="btn-glow"
                              onClick={() => handleEnterLooproom(recommendation.recommended.slug)}
                            >
                              Enter looproom
                            </Button>
                            {recommendation.loopchain.length === 0 && (
                              <Badge variant="outline" className="text-foreground/60">
                                This looproom is a standalone sanctuary – creators will drop next steps soon.
                              </Badge>
                            )}
                            {recommendation.loopchain.map((step) => (
                              <div key={step.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
                                <span className="w-7 h-7 rounded-full bg-vybe-cyan/20 text-vybe-cyan flex items-center justify-center font-semibold">
                                  {step.sequence}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-foreground/80">
                                    {step.nextLooproom?.title || 'Next looproom coming soon'}
                                  </p>
                                  {step.nextLooproom?.category && (
                                    <p className="text-xs text-foreground/50">
                                      {step.nextLooproom.category.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {recommendation.alternatives.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm uppercase tracking-wide text-foreground/50">Backup vibes</p>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {recommendation.alternatives.map((alt) => (
                              <div key={alt.id} className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                                <h4 className="text-lg font-semibold text-gradient">{alt.title}</h4>
                                <p className="text-sm text-foreground/60">{alt.summary}</p>
                                {alt.category && (
                                  <Badge variant="outline" className="border-vybe-pink/40 text-foreground/70">
                                    {alt.category.name}
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-foreground/70 hover:text-vybe-cyan px-0"
                                  onClick={() => handleEnterLooproom(alt.slug)}
                                >
                                  Explore looproom
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!moodMutation.isPending && !recommendation && (
                    <p className="text-foreground/60">
                      Choose a mood preset or drop a custom note to see your personalized loopchain here.
                    </p>
                  )}
                </div>
              </div>

              <aside className="space-y-8">
                <div className="vybe-card border-glow p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gradient">Reaction presets</h2>
                  <p className="text-sm text-foreground/60">
                    These positive-only reactions trigger our motivational overlays. Each one is seeded in the new
                    engagement tables so creators can orchestrate real-time energy.
                  </p>

                  {reactionPresetsQuery.isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-10 rounded-xl bg-white/5" />
                      <Skeleton className="h-10 rounded-xl bg-white/5" />
                      <Skeleton className="h-10 rounded-xl bg-white/5" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reactionPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5"
                        >
                          <span className="text-2xl" role="img" aria-label={preset.label}>
                            {preset.emoji}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{preset.label}</p>
                            <p className="text-xs text-foreground/50">{preset.description}</p>
                          </div>
                          <Badge className="bg-white/10 text-foreground/70">{preset.key}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="vybe-card border-glow p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gradient">Motivation spotlight</h2>
                  <p className="text-sm text-foreground/60">
                    Top seeded messages ready to pop when the community sends a reaction. Each is linked to its
                    looproom so we keep the tone authentic to the journey.
                  </p>

                  {motivationalMessagesQuery.isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 rounded-xl bg-white/5" />
                      <Skeleton className="h-16 rounded-xl bg-white/5" />
                      <Skeleton className="h-16 rounded-xl bg-white/5" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topMotivations.map((message) => (
                        <div key={message.id} className="border border-white/10 rounded-2xl p-4 bg-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                              {message.reactionType}
                            </Badge>
                            {message.looproom && (
                              <span className="text-xs text-foreground/50">{message.looproom.title}</span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/80">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="vybe-card border-glow p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-gradient">Live looprooms snapshot</h2>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-14 rounded-xl bg-white/5" />
                      <Skeleton className="h-14 rounded-xl bg-white/5" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {looprooms.slice(0, 5).map((room) => (
                        <div key={room.id} className="flex items-start justify-between gap-3 border border-white/10 rounded-2xl p-4 bg-white/5">
                          <div>
                            <p className="text-sm font-semibold text-foreground/80">{room.title}</p>
                            <p className="text-xs text-foreground/50 line-clamp-2">{room.summary}</p>
                          </div>
                          {room.category && (
                            <Badge variant="secondary" className="bg-white/10 text-foreground/70">
                              {room.category.name}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;


