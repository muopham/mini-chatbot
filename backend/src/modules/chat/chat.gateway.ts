/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
 WebSocketGateway,
 SubscribeMessage,
 MessageBody,
 ConnectedSocket,
 OnGatewayConnection,
 OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
 Conversation,
 ConversationDocument,
} from '../conversations/schemas/conversations.schemas';
import { MessageDocument } from '../messages/schemas/message.schemas';

@WebSocketGateway({
 cors: {
 origin: process.env.CLIENT_URL || 'http://localhost:3000',
 credentials: true,
 },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
 @WebSocketServer()
 server!: Server;

 private onlineUsers = new Map<string, string>();

 constructor(
 private jwtService: JwtService,
 @InjectModel(User.name) private userModel: Model<UserDocument>,
 @InjectModel(Conversation.name)
 private conversationModel: Model<ConversationDocument>,
 ) {}

 async handleConnection(socket: Socket) {
 try {
 const token = socket.handshake.auth?.token;
 if (!token) {
 socket.disconnect(true);
 return;
 }

 const decoded = this.jwtService.verify(token, {
 secret: process.env.JWT_SECRET,
 });

 if (!decoded) {
 socket.disconnect(true);
 return;
 }

 const user = await this.userModel
 .findById(decoded.userId)
 .select('-password');

 if (!user) {
 socket.disconnect(true);
 return;
 }

 socket.data.user = user;

 const userId = (user.id as any).toString();
 this.onlineUsers.set(userId, socket.id);
 this.server.emit('online-users', Array.from(this.onlineUsers.keys()));

 const conversationIds = await this.getConversationIds(userId);
 conversationIds.forEach((id) => socket.join(id));

 console.log('Client connected:', socket.id);
 } catch (error) {
 console.log(error);
 socket.disconnect(true);
 }
 }

 handleDisconnect(socket: Socket) {
 const user = socket.data.user;
 if (user) {
 const userId = (user._id as any).toString();
 this.onlineUsers.delete(userId);
 this.server.emit('online-users', Array.from(this.onlineUsers.keys()));
 }
 console.log('Client disconnected:', socket.id);
 }

 @SubscribeMessage('sendMessage')
 handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
 console.log('Message:', data);
 this.server.emit('receiveMessage', data);
 }

 @SubscribeMessage('typing')
 handleTyping(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
 const user = client.data.user;
 if (!user) return;
 this.server.to(data.conversationId).emit('user-typing', {
 conversationId: data.conversationId,
 userId: user._id.toString(),
 username: user.displayName,
 });
 }

 @SubscribeMessage('stop-typing')
 handleStopTyping(@MessageBody() data: { conversationId: string }, @ConnectedSocket() client: Socket) {
 const user = client.data.user;
 if (!user) return;
 this.server.to(data.conversationId).emit('user-stopped-typing', {
 conversationId: data.conversationId,
 userId: user._id.toString(),
 });
 }

 // Emit new message
 emitNewMessage(conversation: ConversationDocument, message: MessageDocument) {
 this.server.to(conversation._id.toString()).emit('new-message', {
 message,
 conversation: {
 _id: conversation._id,
 lastMessage: conversation.lastMessage,
 lastMessageAt: conversation.lastMessageAt,
 },
 unreadCounts: conversation.unreadCounts,
 });
 }

 // Emit to a room (conversationId)
 emitToConversation(conversationId: string, event: string, payload: any) {
 this.server.to(conversationId).emit(event, payload);
 }

 // Get conversationIds to auto-join rooms on connect
 private async getConversationIds(userId: string): Promise<string[]> {
 const conversations = await this.conversationModel.find(
 { 'participants.userId': userId },
 { _id: 1 },
 );
 return conversations.map((c) => c._id.toString());
 }
}
