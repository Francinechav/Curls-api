import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment';
import { BlockedDate } from '../entities/blocked-date';
import { Booking } from '../entities/booking';
import { Order } from '../entities/order';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BookingsModule } from '../bookings/bookings.module';
import { InternationalProduct } from 'src/entities/international-product';
import { SpecialOrder } from 'src/entities/special-order';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, BlockedDate, Booking, Order, InternationalProduct,  SpecialOrder]),
    BookingsModule, // allow PaymentsService → BookingsService
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
