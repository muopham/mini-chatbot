/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FriendshipGuard } from '../friends/guards/friendship.guard';
import { GroupMemberGuard } from '../friends/guards/group-member.guard';
import { SendGroupMessageDto } from './dto/send-group-message.dto';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('direct')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FriendshipGuard)
  async sendDirectMessage(
    @CurrentUser() user: { userId: string },
    @Body() sendDirectMessageDto: SendDirectMessageDto,
  ) {
    return this.messagesService.sendDirect(user.userId, sendDirectMessageDto);
  }

  @Post('group')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(GroupMemberGuard)
  async sendGroupMessage(
    @CurrentUser() user: { userId: string },
    @Body() sendGroupMessageDto: SendGroupMessageDto,
    @Req() req: any,
  ) {
    return this.messagesService.sendGroup(
      user.userId,
      req.conversation,
      sendGroupMessageDto,
    );
  }
}
