import { IsOptional, IsString } from 'class-validator';

export class AvailabilityQueryDto {
  @IsOptional()
  @IsString()
  start?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  end?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  date?: string; // YYYY-MM-DD (single date check)
}
