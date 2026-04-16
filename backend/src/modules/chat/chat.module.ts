import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../conversations/schemas/conversations.schemas';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
