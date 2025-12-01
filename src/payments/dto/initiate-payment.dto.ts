import { IsString, IsNumber, IsEmail, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum PaymentType {
  BRIDAL_HIRE = 'bridal_hire',
  INTERNATIONAL = 'international',
  SPECIAL = 'special',
}

export class InitiatePaymentDto {
  @IsEnum(PaymentType)
  type: PaymentType;

  @IsNumber()
  amount: number;

  @IsString()
  currency: 'MWK';

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string; 

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsObject()
  meta?: {
    wigId?: number;
    bookingDate?: string;

    productId?: number;

    // special order fields
    texture?: 'body_wave' | 'straight' | 'water_wave' | 'kinky';
    colour?: string; // special order has "colour"
    length?: string;
    additionalNotes?: string;
    imageUrl?: string;
    district?: string;

    totalAmount?: number;
  };
}
