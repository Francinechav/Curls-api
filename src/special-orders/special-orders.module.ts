import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialOrder } from '../entities/special-order';
import { SpecialOrderService } from './special-orders.service';
import { SpecialOrderController } from './special-orders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialOrder])],
  controllers: [SpecialOrderController],
  providers: [SpecialOrderService],
  exports: [SpecialOrderService]
})
export class SpecialOrderModule {}
