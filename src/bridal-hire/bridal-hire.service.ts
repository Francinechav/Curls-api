import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BridalHireWig } from '../entities/bridal-hire';
import { Product } from '../entities/product';

@Injectable()
export class BridalHireService {
  constructor(
    @InjectRepository(BridalHireWig)
    private bridalHireRepo: Repository<BridalHireWig>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async getAll() {
    return this.bridalHireRepo.find({ relations: ['product'] });
  }

  async createWig(data: {
    wigName: string;
    lengths: string[];
    description?: string;
    price: number;
    discount?: number;
    productId: number;
    imageUrl?: string;
  }) {
    // Load the product first
    const product = await this.productRepo.findOne({ where: { id: data.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const wig = this.bridalHireRepo.create({
      wigName: data.wigName,
      lengths: data.lengths,
      description: data.description,
      price: data.price,
      discount: data.discount,
      imageUrl: data.imageUrl,
      product, // assign the loaded product entity
    });

    return this.bridalHireRepo.save(wig);
  }

  async getAllAdmin() {
  return this.bridalHireRepo.find({
    relations: ['product', 'bookings'],
  });
}

async findOne(id: number) {
  const wig = await this.bridalHireRepo.findOne({
    where: { id },
  });

  if (!wig) throw new NotFoundException('Wig not found');
  return wig;
}


}
