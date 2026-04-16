import { IsMongoId, IsString, IsOptional, MinLength } from 'class-validator';

/**
 * Body của POST /api/messages/direct trong repo gốc:
 * { recipientId, content, conversationId? }
 *
 * recipientId: dùng để tìm/tạo conversation và kiểm tra friendship
 * conversationId: optional — nếu có thì dùng lại conversation cũ
 */
export class SendDirectMessageDto {
  @IsMongoId()
  recipientId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsOptional()
  @IsMongoId()
  conversationId?: string;
}
