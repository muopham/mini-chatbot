/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Friend, FriendDocument } from '../schemas/friend.schemas';

@Injectable()
export class FriendshipGuard implements CanActivate {
  constructor(
    @InjectModel(Friend.name) private friendModel: Model<FriendDocument>,
  ) {}

  private pair(
    a: string,
    b: string,
  ): [mongoose.Types.ObjectId, mongoose.Types.ObjectId] {
    const [smaller, larger] = a < b ? [a, b] : [b, a];
    return [
      new mongoose.Types.ObjectId(smaller),
      new mongoose.Types.ObjectId(larger),
    ];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const me = request.user.userId.toString();
    const recipientId: string | null = request.body?.recipientId ?? null;
    const memberIds: string[] = request.body?.memberIds ?? [];

    if (!recipientId && memberIds.length === 0) {
      throw new BadRequestException('recipientId hoặc memberIds is required');
    }

    if (recipientId) {
      const [userA, userB] = this.pair(me, recipientId);
      const isFriend = await this.friendModel.findOne({ userA, userB }).exec();
      if (!isFriend) {
        throw new ForbiddenException(
          "You haven't added this person as a friend yet!",
        );
      }
      return true;
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = this.pair(me, memberId);
      const friend = await this.friendModel.findOne({ userA, userB });
      return friend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      throw new ForbiddenException('You can only add friends to the group.');
    }

    return true;
  }
}
