import { io, type Socket } from 'socket.io-client';

type ClientToServerEvents = {
  'looproom:join': (payload: { slug: string; participant?: { id?: number | null; name?: string | null; avatarUrl?: string | null } }) => void;
  'looproom:leave': (payload: { slug: string }) => void;
  'looproom:reaction': (payload: { slug?: string; reactionType: string; weight?: number }) => void;
  'looproom:message': (payload: { slug?: string; message: string }) => void;
};

type ServerToClientEvents = {
  'looproom:system': (payload: { type: string; timestamp: string }) => void;
  'looproom:presence': (payload: { type: 'join' | 'leave'; participant: Participant; timestamp: string }) => void;
  'looproom:reaction': (payload: { slug: string; reactionType: string; weight: number; timestamp: string; by: Participant }) => void;
  'looproom:message': (payload: { slug: string; message: string; timestamp: string; by: Participant }) => void;
};

type Participant = {
  id: number | null;
  name: string | null;
  avatarUrl: string | null;
};

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost:3001';

let socket: AppSocket | null = null;

export const getSocket = (): AppSocket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket'],
  });

  return socket;
};

export const destroySocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export type { AppSocket, Participant, ServerToClientEvents, ClientToServerEvents };
