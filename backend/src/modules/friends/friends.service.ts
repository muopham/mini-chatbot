import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend, FriendDocument } from './schemas/friend.schemas';
import mongoose, { Model } from 'mongoose';
import { FriendRequest } from './schemas/friend-request.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<FriendDocument>,
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async sendFriendRequest(from: string, to: string, message?: string) {
    if (from === to) {
      throw new Error('You cannot send a friend request to yourself.');
    }
    const userExists = await this.userModel.findById(to);
    if (!userExists) {
      throw new NotFoundException('User not found.');
    }
    let userA = from.toString();
    let userB = to.toString();
    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }
    const existingFriend = await this.friendModel
      .findOne({
        userA: new mongoose.Types.ObjectId(userA),
        userB: new mongoose.Types.ObjectId(userB),
      })
      .exec();
    if (existingFriend) {
      throw new ConflictException('Already friends');
    }

    const existingRequest = await this.friendRequestModel
      .findOne({ from, to })
      .exec();
    if (existingRequest) {
      throw new ConflictException('Friend request already sent');
    }

    
 // Also check reverse direction: if recipient already sent a request to sender
 const reverseRequest = await this.friendRequestModel
 .findOne({ from: to, to: from })
 .exec();
 if (reverseRequest) {
 throw new ConflictException(
 'This user has already sent you a friend request. Check your received requests.',
 );
 }
const friendRequest = await this.friendRequestModel.create({
      from,
      to,
      message,
    });
    return friendRequest;
  }

  async acceptFriendRequest(requestId: string, userId: string) {
    const request = await this.friendRequestModel
      .findById(requestId)
      .populate('from')
      .populate('to')
      .exec();
    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }

    if (request.to._id.toString() !== userId) {
      throw new ForbiddenException(
        'You are not authorized to accept this friend request.',
      );
    }

    const friend = await this.friendModel.create({
      userA: request.from._id,
      userB: request.to._id,
    });

    await this.friendRequestModel.findByIdAndDelete(requestId).exec();

    return friend;
  }

  async declineFriendRequest(requestId: string, userId: string) {
    const request = await this.friendRequestModel.findById(requestId).exec();
    if (!request) {
      throw new NotFoundException('Friend request not found.');
    }
    if (request.to.toString() !== userId) {
      throw new ForbiddenException(
        'You are not authorized to decline this friend request.',
      );
    }
    await this.friendRequestModel.findByIdAndDelete(requestId).exec();
    return null;
  }

  async getAllFriends(userId: string) {
    const friends = await this.friendModel
      .find({
        $or: [
          { userA: new mongoose.Types.ObjectId(userId) },
          { userB: new mongoose.Types.ObjectId(userId) },
        ],
      })
      .exec();
    return friends;
  }

  async getFriendRequests(userId: string) {
    const requests = await this.friendRequestModel
      .find({ to: new mongoose.Types.ObjectId(userId) })
      .populate('from')
      .exec();
    return requests;
  }

 async getSentRequests(userId: string) {
 const requests = await this.friendRequestModel
 .find({ from: new mongoose.Types.ObjectId(userId) })
 .populate('to')
 .exec();
 return requests;
 }
}