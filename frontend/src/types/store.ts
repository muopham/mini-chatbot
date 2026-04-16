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
 updateProfile: (displayName: string, bio?: string) => Promise<void>;
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
 reset: () => void;
 setActiveConversation: (id: string | null) => void;
 fetchConversation: () => void;
 fetchMessages: (conversationId?: string) => void;
 sendDirectMessage: (
 recipientId: string,
 content: string,
 imgUrl?: string
 ) => void;
 sendGroupMessage: (
 conversationId: string,
 content: string,
 imgUrl?: string
 ) => void;
 addMessage: (message: Message) => Promise<void>;
 updateConversation: (conversation: Partial<Conversation>) => void;
 setTyping: (conversationId: string, userId: string, username: string) => void;
 clearTyping: (conversationId: string, userId: string) => void;
 markAsSeen: () => Promise<void>;
}

export interface SocketState {
 socket: Socket | null;
 onlineUsers: string[];
 connectSocket: () => void;
 disconnectSocket: () => void;
}
