/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schemas';
import {
  Conversation,
  ConversationDocument,
} from '../conversations/schemas/conversations.schemas';
import { ConversationsService } from '../conversations/conversations.service';
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import { SendGroupMessageDto } from './dto/send-group-message.dto';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @Inject(forwardRef(() => ConversationsService))
    private readonly conversationsService: ConversationsService,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}

  async sendDirect(senderId: string, dto: SendDirectMessageDto) {
    const { recipientId, content, conversationId, imgUrl } = dto;
    let conversation: ConversationDocument | null = null;

    if (!content) {
      return new BadRequestException('Content is required');
    }

    if (conversationId) {
      conversation = await this.conversationModel.findById(conversationId);
    }

    if (!conversation) {
      conversation = await this.conversationModel.create({
        type: 'direct',
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await this.messageModel.create({
      conversationId: conversation._id,
      senderId,
      content,
      imgUrl,
    });

    await this.conversationsService.updateAfterMessage(
      conversation,
      message,
      senderId,
    );

    this.chatGateway.emitNewMessage(conversation, message);

    return { message };
  }

  async sendGroup(
    senderId: string,
    conversation: ConversationDocument,
    dto: SendGroupMessageDto,
  ) {
    const { conversationId, content, imgUrl } = dto;

    if (!content) {
      return new BadRequestException('Content is required');
    }

    const message = await this.messageModel.create({
      conversationId: new Types.ObjectId(conversationId),
      senderId,
      content,
      imgUrl,
    });

    await this.conversationsService.updateAfterMessage(
      conversation,
      message,
      senderId,
    );

    this.chatGateway.emitNewMessage(conversation, message);

    return { message };
  }
}
