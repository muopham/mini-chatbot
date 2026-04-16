/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional } from 'class-validator';

export class GetMessagesDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 50;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  cursor?: string;
}
