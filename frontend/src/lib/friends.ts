import api from "./axios";

export interface FriendUser {
 _id: string;
 username: string;
 displayName: string;
 avatarUrl?: string;
}

export interface FriendRequest {
 _id: string;
 from: FriendUser;
 to: string;
 message?: string;
 createdAt: string;
 updatedAt: string;
}

export interface Friend {
 _id: string;
 userA: FriendUser;
 userB: FriendUser;
 createdAt: string;
}

export const friends = {
 searchUsers: async (query: string): Promise<FriendUser[]> => {
 const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
 return res.data;
 },

 sendFriendRequest: async (to: string, message?: string) => {
 const res = await api.post("/friends/requests", { to, message });
 return res.data;
 },

 getFriendRequests: async (): Promise<FriendRequest[]> => {
 const res = await api.get("/friends/requests");
 return res.data;
 },

 acceptFriendRequest: async (requestId: string) => {
 const res = await api.post(`/friends/requests/${requestId}/accept`);
 return res.data;
 },

 declineFriendRequest: async (requestId: string) => {
 await api.post(`/friends/requests/${requestId}/decline`);
 },

 getSentRequests: async (): Promise<FriendRequest[]> => {
 const res = await api.get('/friends/requests/sent');
 return res.data;
 },

 getAllFriends: async (): Promise<Friend[]> => {
  const res = await api.get("/friends");
 return res.data;
 },
};
