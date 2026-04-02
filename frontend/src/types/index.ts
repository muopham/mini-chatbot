export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: "online" | "offline" | "away";
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: "text" | "image" | "file";
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unread?: number;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  date: string;
  type: "document" | "image";
}
