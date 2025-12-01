import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class FinalizeBookingDto {
  @IsString()
  txRef: string;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  bridalWigId?: number;

  @IsOptional()
  @IsDateString()
  bookingDate?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
