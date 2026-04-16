/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationsService } from './conversations.service';
import { FriendshipGuard } from '../friends/guards/friendship.guard';
import { GetMessagesDto } from './dto/get-messages.dto';
import { ChatGateway } from '../chat/chat.gateway';

@UseGuards(JwtGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FriendshipGuard)
  async createConversation(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(dto, user.userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getConversations(@CurrentUser() user: { userId: string }) {
    return this.conversationsService.getConversation(user.userId);
  }

  @Get(':conversationId/messages')
  @HttpCode(HttpStatus.OK)
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Query() query: GetMessagesDto,
  ) {
    return this.conversationsService.getMessages(conversationId, query);
  }

  @Patch(':conversationId/seen')
  @HttpCode(HttpStatus.OK)
  async markAsSeen(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: { userId: string },
  ) {
    const result = await this.conversationsService.markAsSeen(
      conversationId,
      user.userId.toString(),
    );
    if (result.updated) {
      this.chatGateway.emitToConversation(conversationId, 'read-message', {
        conversation: result.updated,
        lastMessage: result.lastMessage,
      });
    }

    return {
      message: 'Mared as seen',
      sendBy: result.updated?.seenBy || [],
      myUnreadCount:
        result.updated?.unreadCounts?.get((user.userId as any).toString()) || 0,
    };
  }
}
