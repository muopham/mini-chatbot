import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type FriendDocument = Friend & Document;

@Schema({ timestamps: true })
export class Friend {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userA: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userB: Types.ObjectId;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.pre('save', function (next) {
  const a = this.userA.toString();
  const b = this.userB.toString();
  if (a > b) {
    this.userA = new Types.ObjectId(b);
    this.userB = new Types.ObjectId(a);
  }
  next();
});

FriendSchema.index(
  {
    userA: 1,
    userB: 1,
  },
  { unique: true },
);

FriendSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

FriendSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});
