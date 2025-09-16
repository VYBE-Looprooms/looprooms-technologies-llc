import { Fragment, useEffect, useMemo, useState, type FormEvent, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sparkles, HeartPulse, Waves, Flame, Apple, Compass, ArrowUpRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  listLooprooms,
  recommendLooproom,
  type LooproomDetail,
  type MoodRecommendationResponse,
} from "@/services/looprooms";
import { fetchReactionPresets, fetchMotivationalMessages } from "@/services/engagement";
import type { ReactionPreset, MotivationalMessage } from "@/services/engagement";
import { useToast } from "@/hooks/use-toast";

const moodOptions: Array<{
  key: string;
  label: string;
  description: string;
  gradient: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    key: "calm",
    label: "Calm & Centered",
    description: "Need guided breathwork + soft grounding.",
    gradient: "from-cyan-400/40 via-sky-500/30 to-blue-500/30",
    icon: Waves,
  },
  {
    key: "anxious",
    label: "Anxious & Overwhelmed",
    description: "Looking for recovery anchors + support.",
    gradient: "from-blue-500/40 via-violet-500/30 to-indigo-500/30",
    icon: HeartPulse,
  },
  {
    key: "energized",
    label: "Energized & Ready",
    description: "Ready to move, sweat, and hype the crew.",
    gradient: "from-fuchsia-500/40 via-pink-500/30 to-orange-400/30",
    icon: Flame,
  },
  {
    key: "drained",
    label: "Drained & Heavy",
    description: "Craving restorative reset rituals.",
    gradient: "from-violet-500/40 via-purple-500/30 to-indigo-500/30",
    icon: Sparkles,
  },
  {
    key: "curious",
    label: "Curious & Inspired",
    description: "Hungry for mindful nutrition and creativity.",
    gradient: "from-amber-400/40 via-rose-400/30 to-pink-500/30",
    icon: Apple,
  },
  {
    key: "lonely",
    label: "Seeking Support",
    description: "Want to share space with recovery allies.",
    gradient: "from-sky-500/40 via-blue-500/30 to-cyan-500/30",
    icon: Compass,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [customMood, setCustomMood] = useState("");
  const [recommendation, setRecommendation] = useState<MoodRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const looproomsQuery = useQuery({
    queryKey: ["looprooms"],
    queryFn: listLooprooms,
  });

  const reactionPresetsQuery = useQuery({
    queryKey: ["reaction-presets"],
    queryFn: fetchReactionPresets,
  });

  const motivationalMessagesQuery = useQuery({
    queryKey: ["motivational-messages"],
    queryFn: fetchMotivationalMessages,
  });

  const moodMutation = useMutation({
    mutationFn: recommendLooproom,
    onSuccess: (response) => {
      if (response.success && response.data) {
        setRecommendation(response.data);
        setError(null);
      } else {
        setError(response.message || "Unable to generate a recommendation.");
      }
    },
    onError: (mutationError) => {
      console.error("[VYBE] Mood recommendation error", mutationError);
      setError("Unable to generate a recommendation right now. Please try again.");
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
  const topMotivations = useMemo(() => motivationalMessages.slice(0, 4), [motivationalMessages]);

  const handleSelectMood = (moodKey: string) => {
    setSelectedMood(moodKey);
    setCustomMood("");
    moodMutation.mutate({ moodKey });
  };

  const handleCustomMood = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customMood.trim()) {
      toast({
        title: "Share a few words first",
        description: "Let us know how you feel or pick a preset mood.",
      });
      return;
    }

    setSelectedMood(null);
    moodMutation.mutate({ moodText: customMood.trim() });
  };

  const isLoading =
    looproomsQuery.isLoading || reactionPresetsQuery.isLoading || motivationalMessagesQuery.isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-vybe-purple/40 to-slate-900 text-foreground">
      <Navbar />
      <main className="flex-1 pt-24 pb-24">
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-0 -top-32 flex justify-center opacity-50">
            <div className="h-72 w-[800px] bg-gradient-to-r from-vybe-cyan/40 via-vybe-purple/40 to-vybe-pink/40 blur-3xl" />
          </div>

          <section className="relative z-10 px-4 sm:px-6 lg:px-12">
            <div className="max-w-7xl mx-auto space-y-12">
              <header className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 sm:px-10 sm:py-12 shadow-2xl shadow-black/30">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-4">
                    <Badge className="bg-white/10 text-xs uppercase tracking-widest border border-white/10 text-foreground/70">
                      Loopchain navigator
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient">
                      Hey {user?.firstName || user?.email}, let&apos;s tune your vibe
                    </h1>
                    <p className="text-foreground/70 max-w-2xl">
                      Tell us how you&apos;re arriving. We&apos;ll surface the right looproom, map the next steps in your loopchain,
                      and highlight the overlays that keep the VYBE community energized and safe.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-vybe-cyan/20 via-vybe-purple/20 to-vybe-pink/20 border border-white/10 px-6 py-5 text-sm text-foreground/80 shadow-lg shadow-black/20">
                    <p className="font-semibold">Current themes</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/60">
                      {['Recovery', 'Meditation', 'Fitness', 'Wellness', 'Healthy Living'].map((theme) => (
                        <span key={theme} className="rounded-full bg-white/10 px-3 py-1">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </header>

              <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-8">
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-gradient">How are you feeling?</h2>
                        <p className="text-sm text-foreground/60">
                          Tap a preset or describe your vibe in your own words.
                        </p>
                      </div>
                      <Badge variant="outline" className="border-vybe-cyan/50 text-foreground/70">
                        Presets + custom check-in
                      </Badge>
                    </div>

                    <div className="-mx-4 sm:mx-0 overflow-x-auto pb-2">
                      <div className="flex min-w-max gap-4 px-4 sm:px-0">
                        {moodOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = selectedMood === option.key;
                          return (
                            <button
                              key={option.key}
                              type="button"
                              onClick={() => handleSelectMood(option.key)}
                              className={`group relative min-w-[220px] rounded-2xl border transition-all duration-300 text-left p-5 focus:outline-none focus:ring-2 focus:ring-vybe-cyan/60 ${
                                isActive
                                  ? 'border-vybe-cyan/70 shadow-lg shadow-vybe-cyan/20'
                                  : 'border-white/10 hover:border-vybe-cyan/50 hover:shadow-lg hover:shadow-vybe-cyan/10'
                              }`}
                            >
                              <div className={`absolute inset-0 opacity-70 rounded-2xl bg-gradient-to-br ${option.gradient}`} />
                              <div className="relative flex flex-col gap-3 text-white">
                                <Icon className="w-8 h-8" />
                                <div>
                                  <h3 className="text-lg font-semibold">{option.label}</h3>
                                  <p className="text-xs text-white/80 leading-relaxed">{option.description}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <form className="space-y-3" onSubmit={handleCustomMood}>
                      <label className="text-sm font-medium text-foreground/80" htmlFor="customMood">
                        Prefer to write it out?
                      </label>
                      <Textarea
                        id="customMood"
                        value={customMood}
                        onChange={(event) => setCustomMood(event.target.value)}
                        placeholder="Example: I feel scattered after a long shift and need gentle accountability."
                        className="resize-none h-24 bg-background/40 border-white/10"
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" className="btn-glow" disabled={moodMutation.isPending}>
                          {moodMutation.isPending ? 'Mapping your loopchain...' : 'Tune my vibe'}
                        </Button>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                      </div>
                    </form>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/20 flex flex-col gap-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-gradient">Recommended journey</h2>
                        <p className="text-sm text-foreground/60">
                          Your primary room plus next loopchain steps. Alternatives stay ready if you want to pivot.
                        </p>
                      </div>
                      <Badge className="bg-vybe-purple/20 text-vybe-purple">AI mood map</Badge>
                    </div>

                    {moodMutation.isPending && (
                      <div className="space-y-4">
                        <Skeleton className="h-24 rounded-2xl bg-white/10" />
                        <Skeleton className="h-14 rounded-2xl bg-white/10" />
                        <Skeleton className="h-28 rounded-2xl bg-white/10" />
                      </div>
                    )}

                    {!moodMutation.isPending && recommendation && (
                      <Fragment>
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-vybe-cyan/20 via-vybe-purple/20 to-transparent p-6 space-y-4">
                            <p className="text-xs uppercase tracking-wide text-foreground/50">Primary recommendation</p>
                            <h3 className="text-3xl font-semibold text-gradient">{recommendation.recommended.title}</h3>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              {recommendation.recommended.summary || recommendation.recommended.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {recommendation.recommended.category && (
                                <Badge className="bg-white/10 text-foreground/80 border-white/10">
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
                            <div className="flex flex-wrap gap-3">
                              <Button className="btn-glow" onClick={() => navigate(`/looprooms/${recommendation.recommended.slug}`)}>
                                Enter looproom
                              </Button>
                              <Button variant="ghost" onClick={() => navigate(`/looprooms/${recommendation.recommended.slug}#schedule`)}>
                                View creator schedule
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-background/60 p-6 space-y-4">
                            <p className="text-xs uppercase tracking-wide text-foreground/50">Loopchain momentum</p>
                            <div className="space-y-3">
                              {recommendation.loopchain.length === 0 && (
                                <Badge variant="outline" className="text-foreground/60 border-white/10">
                                  This looproom is a standalone sanctuary – creator will drop next steps soon.
                                </Badge>
                              )}
                              {recommendation.loopchain.map((step) => (
                                <div key={step.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                  <span className="w-7 h-7 rounded-full bg-vybe-cyan/20 text-vybe-cyan flex items-center justify-center font-semibold">
                                    {step.sequence}
                                  </span>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground/80">
                                      {step.nextLooproom?.title || 'Next looproom coming soon'}
                                    </p>
                                    {step.nextLooproom?.category && (
                                      <p className="text-xs text-foreground/50">{step.nextLooproom.category.name}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {recommendation.alternatives.length > 0 && (
                          <div className="rounded-2xl border border-white/10 bg-background/40 p-6 space-y-3">
                            <p className="text-xs uppercase tracking-wide text-foreground/50">Optional detours</p>
                            <div className="grid gap-4 md:grid-cols-2">
                              {recommendation.alternatives.map((alt) => (
                                <div key={alt.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-gradient">{alt.title}</p>
                                      <p className="text-xs text-foreground/60 line-clamp-2">{alt.summary}</p>
                                    </div>
                                    {alt.category && (
                                      <Badge variant="outline" className="border-vybe-pink/40 text-foreground/70">
                                        {alt.category.name}
                                      </Badge>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-0 text-foreground/70 hover:text-vybe-cyan"
                                    onClick={() => navigate(`/looprooms/${alt.slug}`)}
                                  >
                                    Explore looproom
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Fragment>
                    )}

                    {!moodMutation.isPending && !recommendation && (
                      <p className="text-sm text-foreground/60">
                        Choose a mood preset or drop a custom note to see your personalized loopchain here.
                      </p>
                    )}
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gradient">Reaction palette</h3>
                      <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                        {reactionPresets.length} presets
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/60">
                      Positive-only reactions that trigger motivational overlays.
                    </p>
                    {reactionPresetsQuery.isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-10 rounded-xl bg-white/10" />
                        <Skeleton className="h-10 rounded-xl bg-white/10" />
                        <Skeleton className="h-10 rounded-xl bg-white/10" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reactionPresets.map((preset) => (
                          <div
                            key={preset.id}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                          >
                            <span className="text-2xl" role="img" aria-label={preset.label}>
                              {preset.emoji}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-foreground/80">{preset.label}</p>
                              <p className="text-xs text-foreground/50">{preset.description}</p>
                            </div>
                            <Badge className="bg-white/10 text-foreground/70">{preset.key}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gradient">Motivation spotlight</h3>
                      <MessageCircle className="h-4 w-4 text-vybe-cyan" />
                    </div>
                    <p className="text-sm text-foreground/60">
                      Fresh overlays primed for reaction surges. Creators can remix copy per room.
                    </p>
                    {motivationalMessagesQuery.isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 rounded-xl bg-white/10" />
                        <Skeleton className="h-16 rounded-xl bg-white/10" />
                        <Skeleton className="h-16 rounded-xl bg-white/10" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {topMotivations.map((message) => (
                          <div key={message.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                                {message.reactionType}
                              </Badge>
                              {message.looproom && (
                                <span className="text-xs text-foreground/50">{message.looproom.title}</span>
                              )}
                            </div>
                            <p className="text-sm text-foreground/80 leading-relaxed">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4 shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gradient">Live looprooms snapshot</h3>
                      <Badge variant="outline" className="border-white/15 text-foreground/70">
                        {looprooms.length} rooms
                      </Badge>
                    </div>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-14 rounded-xl bg-white/10" />
                        <Skeleton className="h-14 rounded-xl bg-white/10" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {looprooms.slice(0, 5).map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => navigate(`/looprooms/${room.slug}`)}
                            className="w-full text-left rounded-2xl border border-white/10 bg-white/5 px-4 py-3 flex items-start justify-between gap-3 hover:border-vybe-cyan/50 hover:shadow-lg hover:shadow-vybe-cyan/10 transition-all"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground/80">{room.title}</p>
                              <p className="text-xs text-foreground/50 line-clamp-2">{room.summary}</p>
                            </div>
                            {room.category && (
                              <Badge variant="secondary" className="bg-white/10 text-foreground/70">
                                {room.category.name}
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </aside>
              </section>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
