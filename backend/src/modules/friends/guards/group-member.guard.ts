/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from 'src/modules/conversations/schemas/conversations.schemas';

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { conversationId } = request.body;
    const userId = request.user.userId.toString();

    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException('Not found conversation');
    }

    const isMember = conversation.participants.some(
      (p) => p.userId.toString() === userId,
    );

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this group.');
    }

    request.conversation = conversation;
    return true;
  }
}
