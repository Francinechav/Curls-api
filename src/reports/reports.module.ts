import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller'; // ✅ import

import { User } from '../entities/user';
import { Order } from '../entities/order';
import { Payment } from '../entities/payment';
import { Booking } from '../entities/booking';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Payment, Booking]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController], // ✅ add controller here
  exports: [ReportsService],
})
export class ReportsModule {}
