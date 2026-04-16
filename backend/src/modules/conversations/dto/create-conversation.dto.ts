import {
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConversationDto {
  @IsIn(['direct', 'group'])
  type: 'direct' | 'group';

  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @IsMongoId({ each: true })
  memberIds: string[];
}
