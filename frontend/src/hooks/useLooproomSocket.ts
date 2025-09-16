import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getSocket, type AppSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';

export type LooproomSocketConnection = 'disconnected' | 'connecting' | 'connected';

type ReactionPayload = {
  slug: string;
  reactionType: string;
  weight: number;
  timestamp: string;
  summary?: Array<{ reactionType: string; total: number }>;
};

type MessagePayload = {
  id?: number;
  slug: string;
  message: string;
  messageType?: string;
  timestamp: string;
  byName: string | null;
};

type MotivationPayload = {
  slug: string;
  reactionType: string;
  message: string;
  timestamp: string;
};

type PresencePayload = {
  type: 'join' | 'leave';
  name: string | null;
  timestamp: string;
};

type LooproomSocketOptions = {
  enabled?: boolean;
  onReaction?: (payload: ReactionPayload) => void;
  onMessage?: (payload: MessagePayload) => void;
  onPresence?: (payload: PresencePayload) => void;
  onMotivation?: (payload: MotivationPayload) => void;
};

const useLooproomSocket = (slug: string | null, options: LooproomSocketOptions = {}) => {
  const { user } = useAuth();
  const socketRef = useRef<AppSocket | null>(null);
  const [connectionState, setConnectionState] = useState<LooproomSocketConnection>('disconnected');

  const { enabled = true, onReaction, onMessage, onPresence, onMotivation } = options;

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => setConnectionState('connected');
    const handleDisconnect = () => setConnectionState('disconnected');
    const handleConnecting = () => setConnectionState('connecting');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.io.on('reconnect_attempt', handleConnecting);
    socket.io.on('reconnect', handleConnect);
    socket.io.on('connect_error', handleDisconnect);

    if (!socket.connected) {
      handleConnecting();
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.io.off('reconnect_attempt', handleConnecting);
      socket.io.off('reconnect', handleConnect);
      socket.io.off('connect_error', handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !slug || !enabled) {
      return;
    }

    const participant = {
      id: user?.id ?? null,
      name: user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Guest',
      avatarUrl: user?.avatarUrl ?? null,
    };

    socket.emit('looproom:join', { slug, participant });

    return () => {
      socket.emit('looproom:leave', { slug });
    };
  }, [slug, enabled, user?.id, user?.firstName, user?.lastName, user?.email, user?.avatarUrl]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleReaction = (payload: any) => {
      onReaction?.({
        slug: payload.slug,
        reactionType: payload.reactionType,
        weight: payload.weight,
        timestamp: payload.timestamp,
        summary: payload.summary,
      });
    };

    const handleMessage = (payload: any) => {
      onMessage?.({
        id: payload.id,
        slug: payload.slug,
        message: payload.message,
        messageType: payload.messageType,
        timestamp: payload.timestamp,
        byName: payload.displayName ?? payload.by?.name ?? null,
      });
    };

    const handlePresence = (payload: any) => {
      onPresence?.({
        type: payload.type,
        name: payload.participant?.name ?? null,
        timestamp: payload.timestamp,
      });
    };

    const handleMotivation = (payload: any) => {
      onMotivation?.({
        slug: payload.slug,
        reactionType: payload.reactionType,
        message: payload.message,
        timestamp: payload.timestamp,
      });
    };

    socket.on('looproom:reaction', handleReaction);
    socket.on('looproom:message', handleMessage);
    socket.on('looproom:presence', handlePresence);
    socket.on('looproom:motivation', handleMotivation);

    return () => {
      socket.off('looproom:reaction', handleReaction);
      socket.off('looproom:message', handleMessage);
      socket.off('looproom:presence', handlePresence);
      socket.off('looproom:motivation', handleMotivation);
    };
  }, [onReaction, onMessage, onPresence, onMotivation]);

  const sendReaction = useCallback(
    (reactionType: string, weight = 1) => {
      if (!socketRef.current) return;
      socketRef.current.emit('looproom:reaction', { slug: slug ?? undefined, reactionType, weight });
    },
    [slug]
  );

  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current) return;
      socketRef.current.emit('looproom:message', { slug: slug ?? undefined, message });
    },
    [slug]
  );

  return useMemo(
    () => ({
      sendReaction,
      sendMessage,
      connectionState,
    }),
    [sendReaction, sendMessage, connectionState]
  );
};

export default useLooproomSocket;
