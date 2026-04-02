import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  //ng nhận
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  senderId: User;
  //ng gửi
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  receiverId: User;
  @Prop({ required: true })
  content: string;
  @Prop({ default: null })
  imageUrl: string;
  @Prop({ default: false })
  isRead: boolean;
  @Prop({ default: null })
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

MessageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MessageSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
