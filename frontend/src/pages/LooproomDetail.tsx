import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getLooproomBySlug } from "@/services/looprooms";
import { fetchReactionPresets } from "@/services/engagement";
import useLooproomSocket from "@/hooks/useLooproomSocket";

interface ChatMessage {
  id?: number;
  message: string;
  messageType: string;
  timestamp?: string | null;
  byName: string | null;
}

const formatTimestamp = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const LooproomDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const looproomQuery = useQuery({
    queryKey: ["looproom", slug],
    queryFn: () => getLooproomBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

  const reactionPresetsQuery = useQuery({
    queryKey: ["reaction-presets"],
    queryFn: fetchReactionPresets,
  });

  const looproom = useMemo(() => looproomQuery.data?.data, [looproomQuery.data]);
  const reactionPresets = reactionPresetsQuery.data?.data ?? [];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messageIdsRef = useRef<Set<number>>(new Set());
  const [messageInput, setMessageInput] = useState("");
  const [reactionSummary, setReactionSummary] = useState<Record<string, number>>({});
  const [motivationQueue, setMotivationQueue] = useState<Array<{ slug: string; reactionType: string; message: string; timestamp: string }>>([]);
  const [activeMotivation, setActiveMotivation] = useState<{ slug: string; reactionType: string; message: string; timestamp: string } | null>(null);

  const { sendMessage, sendReaction, connectionState } = useLooproomSocket(slug ?? null, {
    enabled: Boolean(slug),
    onMessage: (payload) => {
      if (payload.id && messageIdsRef.current.has(payload.id)) {
        return;
      }
      if (payload.id) {
        messageIdsRef.current.add(payload.id);
      }
      setMessages((previous) => [
        ...previous,
        {
          id: payload.id,
          message: payload.message,
          messageType: payload.messageType || "chat",
          timestamp: payload.timestamp,
          byName: payload.byName,
        },
      ].slice(-200));
    },
    onPresence: (payload) => {
      const name = payload.name || "Someone";
      const text = payload.type === "join" ? `${name} joined the room` : `${name} left the room`;
      setMessages((previous) => [
        ...previous,
        {
          message: text,
          messageType: "system",
          timestamp: payload.timestamp,
          byName: null,
        },
      ].slice(-200));
    },
    onReaction: (payload) => {
      if (payload.summary?.length) {
        const next: Record<string, number> = {};
        payload.summary.forEach((entry) => {
          next[entry.reactionType] = entry.total;
        });
        setReactionSummary(next);
      } else {
        setReactionSummary((previous) => ({
          ...previous,
          [payload.reactionType]: (previous[payload.reactionType] || 0) + payload.weight,
        }));
      }
    },
    onMotivation: (payload) => {
      setMotivationQueue((previous) => [...previous, payload]);
    },
  });

  useEffect(() => {
    if (!looproom) {
      return;
    }

    const initialMessages = (looproom.recentMessages ?? []).map((item) => ({
      id: item.id,
      message: item.message,
      messageType: item.messageType || "chat",
      timestamp: item.timestamp || null,
      byName: item.displayName ?? null,
    }));

    messageIdsRef.current = new Set(initialMessages.filter((msg) => msg.id).map((msg) => msg.id as number));
    setMessages(initialMessages);

    const summary: Record<string, number> = {};
    (looproom.reactionSummary ?? []).forEach((entry) => {
      summary[entry.reactionType] = entry.total;
    });
    setReactionSummary(summary);
  }, [looproom]);

  useEffect(() => {
    if (!activeMotivation && motivationQueue.length > 0) {
      setActiveMotivation(motivationQueue[0]);
      setMotivationQueue((previous) => previous.slice(1));
    }
  }, [motivationQueue, activeMotivation]);

  useEffect(() => {
    if (!activeMotivation) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveMotivation(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeMotivation]);

  const isLoading = looproomQuery.isLoading;
  const hasError = looproomQuery.isError;

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) {
      return;
    }

    sendMessage(trimmed);
    setMessageInput("");
  };

  const handleReactionClick = (reactionKey: string) => {
    sendReaction(reactionKey);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <section className="w-full px-4 sm:px-6 lg:px-12">
          <div className="w-full space-y-10">
            {isLoading && (
              <div className="space-y-6">
                <Skeleton className="h-24 rounded-3xl bg-white/5" />
                <Skeleton className="h-80 rounded-3xl bg-white/5" />
                <Skeleton className="h-40 rounded-3xl bg-white/5" />
              </div>
            )}

            {hasError && !isLoading && (
              <div className="vybe-card border-glow p-10 text-center space-y-4">
                <h1 className="text-3xl font-semibold text-gradient">Looproom not found</h1>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  We couldn&apos;t find the looproom you were looking for. Try exploring the dashboard for a fresh
                  recommendation.
                </p>
                <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
              </div>
            )}

            {looproom && (
              <div className="space-y-10">
                <header className="vybe-card border-glow p-10 flex flex-col gap-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-foreground/50">Looproom spotlight</p>
                      <h1 className="text-4xl md:text-5xl font-bold text-gradient">{looproom.title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                        Realtime: {connectionState}
                      </Badge>
                      {looproom.category && (
                        <Badge className="bg-white/10 text-foreground/80 border border-white/10">
                          {looproom.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-lg text-foreground/70 max-w-3xl">{looproom.summary}</p>
                  {looproom.description && (
                    <p className="text-foreground/60 max-w-3xl leading-relaxed">{looproom.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {looproom.videoUrl && (
                      <Button asChild className="btn-glow">
                        <a href={looproom.videoUrl} target="_blank" rel="noreferrer">
                          Watch session
                        </a>
                      </Button>
                    )}
                    {looproom.playlistUrl && (
                      <Button asChild variant="outline" className="border-vybe-cyan/40 hover:bg-vybe-cyan/10">
                        <a href={looproom.playlistUrl} target="_blank" rel="noreferrer">
                          Open playlist
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
                  </div>
                </header>

                <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                  <div className="vybe-card border-glow p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gradient">Community chat</h2>
                      <Badge variant="outline" className="border-vybe-purple/40 text-foreground/70">
                        {messages.length} messages
                      </Badge>
                    </div>
                    <div className="h-72 rounded-2xl bg-white/5 border border-white/10 overflow-y-auto px-4 py-3 space-y-3">
                      {messages.length === 0 && (
                        <p className="text-sm text-foreground/60">No messages yet. Say hello to kick things off.</p>
                      )}
                      {messages.map((chat, index) => (
                        <div key={chat.id ?? `local-${index}`} className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-foreground/50">
                            <span className="font-semibold text-foreground/70">
                              {chat.messageType === "system" ? "System" : chat.byName ?? "Guest"}
                            </span>
                            {chat.timestamp && <span>{formatTimestamp(chat.timestamp)}</span>}
                          </div>
                          <p
                            className={chat.messageType === "system"
                              ? "text-xs text-foreground/50"
                              : "text-sm text-foreground/80"}
                          >
                            {chat.message}
                          </p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                      <Textarea
                        placeholder="Share something uplifting..."
                        value={messageInput}
                        onChange={(event) => setMessageInput(event.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-foreground/50">Positive-only vibes. Keep it supportive.</span>
                        <Button type="submit" disabled={connectionState === 'disconnected' || messageInput.trim().length === 0}>
                          Send message
                        </Button>
                      </div>
                    </form>
                  </div>
                  <div className="vybe-card border-glow p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gradient">Reaction energy</h2>
                      <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                        {Object.values(reactionSummary).reduce((acc, value) => acc + value, 0)} total
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">
                      Tap a reaction to send supportive energy. Motivational overlays trigger automatically when the
                      community lights up.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {reactionPresets.map((preset) => (
                        <Button
                          key={preset.id}
                          type="button"
                          variant="outline"
                          className="justify-start gap-3 border-white/10 hover:border-vybe-cyan/60"
                          onClick={() => handleReactionClick(preset.key)}
                          disabled={connectionState !== 'connected'}
                        >
                          <span className="text-xl" role="img" aria-label={preset.label}>
                            {preset.emoji}
                          </span>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-semibold text-foreground/80">{preset.label}</p>
                            <p className="text-xs text-foreground/50">{preset.description}</p>
                          </div>
                          <Badge variant="secondary" className="bg-white/10 text-foreground/70">
                            {reactionSummary[preset.key] ?? 0}
                          </Badge>
                        </Button>
                      ))}
                      {reactionPresets.length === 0 && (
                        <p className="text-sm text-foreground/60 col-span-2">
                          Reaction presets are loading. One moment...
                        </p>
                      )}
                    </div>
                    {activeMotivation && (
                      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-vybe-cyan/10 border border-vybe-cyan/30 px-4 py-3 shadow-lg shadow-vybe-cyan/20 animate-in fade-in">
                        <p className="text-xs uppercase tracking-wide text-vybe-cyan">Motivation boost</p>
                        <p className="text-sm text-foreground/80 mt-1">{activeMotivation.message}</p>
                      </div>
                    )}
                  </div>
                </section>

                {looproom.loopchain.length > 0 && (
                  <section className="vybe-card border-glow p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-gradient">Loopchain journey</h2>
                      <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                        {looproom.loopchain.length} steps
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {looproom.loopchain.map((step) => (
                        <div key={step.id} className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-vybe-cyan/20 text-vybe-cyan font-semibold">
                              {step.sequence}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground/80">
                                {step.nextLooproom?.title || "Next looproom coming soon"}
                              </p>
                              {step.nextLooproom?.category && (
                                <p className="text-xs text-foreground/50">{step.nextLooproom.category.name}</p>
                              )}
                            </div>
                          </div>
                          {step.nextLooproom && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-0 text-foreground/70 hover:text-vybe-cyan"
                              onClick={() => navigate(`/looprooms/${step.nextLooproom?.slug}`)}
                            >
                              Continue journey
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {looproom.motivationalMessages.length > 0 && (
                  <section className="vybe-card border-glow p-8 space-y-4">
                    <h2 className="text-2xl font-semibold text-gradient">Motivational overlays</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {looproom.motivationalMessages.map((message) => (
                        <div key={message.id} className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-2">
                          <Badge variant="outline" className="border-vybe-cyan/40 text-foreground/70">
                            {message.reactionType}
                          </Badge>
                          <p className="text-sm text-foreground/70 leading-relaxed">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LooproomDetail;
