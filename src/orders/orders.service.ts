import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // Get all orders for admin
  async getAllOrders() {
    return this.orderRepo.find({
      relations: ['user', 'product', 'payments'],
      order: { id: 'DESC' }, // newest first
    });
  }

  // Optional: Get orders by wig ID
  async findByWigId(wigId: number) {
  const orders = await this.orderRepo.find({
    where: { product: { id: wigId } },
    relations: ['user', 'product', 'payments'],
    order: { id: 'DESC' }, // newest first
  });

  // Map backend entity to frontend-friendly format
  return orders.map(o => ({
    id: o.id,
    customerName: `${o.first_name || ''} ${o.last_name || ''}`.trim(),
    customerEmail: o.email,
    customerPhone: o.phoneNumber,
    transactionId: o.payments?.[0]?.id || null, // or transactionId if exists
    status: o.status,
  }));
}


  async updateOrderStatus(id: number, status: 'pending' | 'processing' | 'completed') {
  const order = await this.orderRepo.findOne({ where: { id } });

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  return this.orderRepo.save(order);
}

}
