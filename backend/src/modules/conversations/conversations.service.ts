/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversations.schemas';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../messages/schemas/message.schemas';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { GetMessagesDto } from './dto/get-messages.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createConversation(dto: CreateConversationDto, userId: string) {
    const { type, memberIds, name } = dto;

    if (
      !type ||
      (type === 'group' && !name) ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0
    ) {
      throw new BadRequestException(
        'Invalid conversation type or missing name for group',
      );
    }

    let conversation: ConversationDocument;
    if (type === 'direct') {
      const participantId = memberIds[0];
      const existing = await this.conversationModel.findOne({
        type: 'direct',
        'participants.userId': { $all: [userId, participantId] },
      });

      if (existing) {
        conversation = existing;
      } else {
        conversation = new this.conversationModel({
          type: 'direct',
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });
        await conversation.save();
      }
    } else if (type === 'group') {
      conversation = new this.conversationModel({
        type: 'group',
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: { name, createdBy: userId },
        lastMessageAt: new Date(),
      });
      await conversation.save();
    } else {
      throw new BadRequestException('Unsupported conversation type');
    }

    await conversation.populate([
      { path: 'participants.userId', select: 'displayName avatarUrl' },
      { path: 'seenBy', select: 'displayName avatarUrl' },
      { path: 'lastMessage.senderId', select: 'displayName avatarUrl' },
    ]);

    return conversation;
  }

  async getConversation(userId: string) {
    const conversations = await this.conversationModel
      .find({ 'participants.userId': userId })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate([
        { path: 'participants.userId', select: 'displayName avatarUrl' },
      ])
      .populate([
        { path: 'lastMessage.senderId', select: 'displayName avatarUrl' },
      ])
      .populate([{ path: 'seenBy', select: 'displayName avatarUrl' }]);

    const formatted = conversations.map((c) => this.formatConversation(c));
    return { conversations: formatted };
  }

  async getMessages(conversationId: string, queryDto: GetMessagesDto) {
    const { limit = 50, cursor } = queryDto;
    const query: any = {
      conversationId: new Types.ObjectId(conversationId),
    };
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
 let messages = await this.messageModel
 .find(query)
 .sort({ createdAt: -1 })
 .limit(Number(limit) + 1)
 .lean();

 let nextCursor: string | null = null;
 if (messages.length > Number(limit)) {
 // messages sorted newest-first: [T_newest, ..., T_oldest]
 // cursor = timestamp của message cũ nhất trong batch -> query tiếp page cũ hơn
 nextCursor = (
  messages[messages.length - 1] as any
 ).createdAt.toISOString();
 messages.pop();
 }
 // Trả về newest-first để frontend merge prepend đúng thứ tự
 messages.reverse();
 return { messages, nextCursor };
  }

  async markAsSeen(conversationId: string, userId: string) {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .lean();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const last = conversation.lastMessage;

    if (!last) {
      return { message: 'No message mark as seen' };
    }

    if (last.senderId.toString() === userId) {
      return { message: 'Sender dont mark as seen' };
    }

    const updated = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      { new: true },
    );

    return {
      updated,
      lastMessage: {
        _id: updated?.lastMessage._id,
        content: updated?.lastMessage.content,
        createdAt: updated?.lastMessage.createdAt,
        sender: { _id: updated?.lastMessage.senderId },
      },
    };
  }

  // Cập nhật conversation sau khi có tin nhắn mới
  async updateAfterMessage(
    conversation: ConversationDocument,
    message: MessageDocument,
    senderId: string,
  ): Promise<void> {
    conversation.set({
      seenBy: [],
      lastMessageAt: (message as any).createdAt,
      lastMessage: {
        _id: message.id,
        content: message.content,
        senderId: new Types.ObjectId(senderId),
        createdAt: (message as any).createdAt,
      },
    });

    conversation.participants.forEach((p) => {
      const memberId = p.userId.toString();
      const isSender = memberId === senderId;
      const prevCount = conversation.unreadCounts.get(memberId) || 0;
      conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
    });

    await conversation.save();
  }

  private formatConversation(conversation: ConversationDocument) {
    const participants = (conversation.participants || []).map((p: any) => ({
      _id: p.userId?._id,
      displayName: p.userId?.displayName,
      avatarUrl: p.userId?.avatarUrl ?? null,
      joinedAt: p.joinedAt,
    }));

    return {
      ...conversation.toObject(),
      unreadCounts: conversation.unreadCounts || {},
      participants,
    };
  }

  async getConversationIdsForSocket(userId: string): Promise<string[]> {
    const conversations = await this.conversationModel.find(
      { 'participants.userId': userId },
      { _id: 1 },
    );
    return conversations.map((c) => c._id.toString());
  }
}
