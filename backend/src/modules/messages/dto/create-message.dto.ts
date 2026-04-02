import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  receiverId: string;
  @IsString()
  @IsOptional()
  content?: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
