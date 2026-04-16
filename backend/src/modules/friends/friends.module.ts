import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './schemas/friend.schemas';
import { FriendsController } from './friends.controller';
import {
  FriendRequest,
  FriendRequestSchema,
} from './schemas/friend-request.schema';
import { FriendsService } from './friends.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friend.name, schema: FriendSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UsersModule,
    AuthModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService, MongooseModule],
})
export class FriendsModule {}
