// backend/src/bookings/bookings.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking';
import { BlockedDate } from '../entities/blocked-date';
import { Payment } from '../entities/payment';
import { User } from '../entities/user';
import { JwtModule } from '../jwt/jwt.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BlockedDate, Payment, User]),
    JwtModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
