import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialOrder } from '../entities/special-order';

@Injectable()
export class SpecialOrderService {
  constructor(
    @InjectRepository(SpecialOrder)
    private specialOrderRepo: Repository<SpecialOrder>,
  ) {}

  findByTxRef(txRef: string) {
    return this.specialOrderRepo.findOne({
      where: { txRef },
      relations: ['user'], // optional if you want user details
    });
  }

  findAll() {
    return this.specialOrderRepo.find({
      relations: [], // add 'user' if needed
      order: { createdAt: 'DESC' },
    });
  }


 async updateStatus(id: number, status: string) {
    const order = await this.specialOrderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Special order not found');

    order.status = status as any; // cast to match enum type
    await this.specialOrderRepo.save(order);

    return order;
  }

}

