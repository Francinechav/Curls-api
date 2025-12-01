import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Admin endpoint: list all orders
  @Get('admin/all')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // Optional endpoint: orders by wig/product ID
  @Get('by-wig/:wigId')
  getOrdersByWig(@Param('wigId') wigId: number) {
    return this.ordersService.findByWigId(wigId);
  }

// ⭐ UPDATE ORDER STATUS
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body('status') status: 'pending' | 'processing' | 'completed',
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }

}
