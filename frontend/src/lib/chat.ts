import { Message } from "@/types/chat";
import api from "./axios";

interface FetchMessageProps {
  messages: Message[];
  cursor?: string;
}

export const chat = {
  async fetchConversation() {
    const res = await api.get("/conversations");
    return res.data;
  },

  async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
    const params = new URLSearchParams({ limit: "15" });
    if (cursor) {
      params.append("cursor", cursor);
    }
    const res = await api.get(`/conversations/${id}/messages?${params}`);
    return { messages: res.data.messages, cursor: res.data.nextCursor };
  },

  async sendDirectMessage(
    recipientId: string,
    content: string = "",
    imgUrl?: string,
    conversationId?: string
  ) {
    const res = await api.post("/messages/direct", {
      recipientId,
      content,
      imgUrl,
      conversationId,
    });
    return res.data.message;
  },

  async sendGroupMessage(
    conversationId: string,
    content: string = "",
    imgUrl?: string
  ) {
    const res = await api.post("/messages/group", {
      conversationId,
      content,
      imgUrl,
    });
    return res.data.message;
  },

  async markAsSeen(conversationId: string) {
    const res = await api.patch(`/conversations/${conversationId}/seen`);
    return res.data;
  },

  async createGroup(name: string, memberIds: string[]) {
    const res = await api.post("/conversations", {
      type: "group",
      name,
      memberIds,
    });
    return res.data;
  },
};
