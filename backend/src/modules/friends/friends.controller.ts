import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  async sendFriendRequest(
    @CurrentUser() user: { userId: string },
    @Body() body: { to: string; message?: string },
  ) {
    return await this.friendsService.sendFriendRequest(
      user.userId,
      body.to,
      body.message,
    );
  }

  @Post('requests/:requestId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('requestId') requestId: string,
  ) {
    return await this.friendsService.acceptFriendRequest(
      requestId,
      user.userId,
    );
  }

  @Post('requests/:requestId/decline')
  @HttpCode(HttpStatus.NO_CONTENT)
  async declineFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('requestId') requestId: string,
  ) {
    return await this.friendsService.declineFriendRequest(
      requestId,
      user.userId,
    );
  }

  @Get()
  async getAllFriends(@CurrentUser() user: { userId: string }) {
    return await this.friendsService.getAllFriends(user.userId);
  }

  @Get('requests')
  async getFriendRequests(@CurrentUser() user: { userId: string }) {
    return await this.friendsService.getFriendRequests(user.userId);
  }

 @Get("requests/sent")
 async getSentRequests(@CurrentUser() user: { userId: string }) {
 return await this.friendsService.getSentRequests(user.userId);
 }
}
