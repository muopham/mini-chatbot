import { Socket } from "socket.io-client";
import { Conversation, Message } from "./chat";
import type { User } from "./user";

export interface AuthState {
 accessToken: string | null;
 user: User | null;
 loading: boolean;

 setAccessToken: (accessToken: string | null) => void;
 clear: () => void;
 signUp: (
  email: string,
  password: string,
  displayName: string,
  username: string
 ) => Promise<void>;
 signIn: (username: string, password: string) => Promise<void>;
 logOut: () => Promise<void>;
 fetchMe: () => Promise<void>;
 refresh: () => Promise<void>;
 updateProfile: (displayName: string, bio?: string, avatarUrl?: string) => Promise<void>;
}
export interface ChatState {
 conversations: Conversation[];
 messages: Record<
  string,
  {
   items: Message[];
   hasMore: boolean;
   nextCursor?: string | null;
   didFetch?: boolean;
  }
 >;
 activeConversationId: string | null;
 converLoading: boolean;
 messageLoading: boolean;
 typingUsers: Record<string, { userId: string; username: string }[]>;
  drafts: Record<string, string>;
  reset: () => void;
  setActiveConversation: (id: string | null) => void;
  setDraft: (conversationId: string, content: string) => void;
  clearDraft: (conversationId: string) => void;
  fetchConversation: () => Promise<void>;
 fetchMessages: (conversationId?: string) => Promise<void>;
 createDirectConversation: (memberId: string) => Promise<Conversation | null>;
 sendDirectMessage: (
  recipientId: string,
  content: string,
  imgUrl?: string
 ) => Promise<void>;
 sendGroupMessage: (
  conversationId: string,
  content: string,
  imgUrl?: string
 ) => Promise<void>;
 retryMessage: (conversationId: string, messageId: string) => Promise<void>;
 addMessage: (message: Message) => Promise<void>;
 updateConversation: (conversation: Partial<Conversation>) => void;
 setTyping: (conversationId: string, userId: string, username: string) => void;
 clearTyping: (conversationId: string, userId: string) => void;
 clearTypingForConversation: (conversationId: string) => void;
 markAsSeen: () => Promise<void>;
}

export interface SocketState {
 socket: Socket | null;
 onlineUsers: string[];
 connectSocket: () => void;
 disconnectSocket: () => void;
}
