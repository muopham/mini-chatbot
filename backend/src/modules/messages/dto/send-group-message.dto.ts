import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class SendGroupMessageDto {
  @IsMongoId()
  conversationId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;
}
