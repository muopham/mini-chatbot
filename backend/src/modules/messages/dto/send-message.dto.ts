import { IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  content?: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
