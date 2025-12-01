import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order';

@Module({
  imports: [TypeOrmModule.forFeature([Order])], // Register Order entity
  controllers: [OrdersController],             // Register controller
  providers: [OrdersService],                  // Register service
  exports: [OrdersService],                    // Export service if used elsewhere
})
export class OrdersModule {}
