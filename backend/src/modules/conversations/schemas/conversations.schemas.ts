import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ _id: false })
class Participant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

const ParticipantSchema = SchemaFactory.createForClass(Participant);

@Schema({ _id: false })
class Group {
  @Prop({ trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

const GroupSchema = SchemaFactory.createForClass(Group);

@Schema({ _id: false })
class LastMessage {
  @Prop()
  _id: string;

  @Prop({ default: null })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ default: null })
  createdAt: Date;
}

const LastMessageSchema = SchemaFactory.createForClass(LastMessage);

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: String,
    enum: ['direct', 'group'],
    required: true,
  })
  type: 'direct' | 'group';

  @Prop({
    type: [ParticipantSchema],
    required: true,
  })
  participants: Participant[];

  @Prop({ type: GroupSchema })
  group?: Group;

  @Prop()
  lastMessageAt: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
  })
  seenBy: Types.ObjectId[];

  @Prop({
    type: LastMessageSchema,
    default: null,
  })
  lastMessage: LastMessage;

  @Prop({
    type: Map,
    of: Number,
    default: {},
  })
  unreadCounts: Map<string, number>;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({
  'participants.userId': 1,
  lastMessageAt: -1,
});

ConversationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ConversationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
