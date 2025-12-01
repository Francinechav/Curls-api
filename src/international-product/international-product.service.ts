import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternationalProduct } from '../entities/international-product';

@Injectable()
export class InternationalProductsService {
  constructor(
    @InjectRepository(InternationalProduct)
    private readonly internationalRepo: Repository<InternationalProduct>,
  ) {}

  async getAllActiveProducts(): Promise<InternationalProduct[]> {
    return this.internationalRepo.find({
      where: { active: true },
      relations: ['product'],
    });
  }

  // NEW: create product with image
  async createProduct(data: Partial<InternationalProduct>): Promise<InternationalProduct> {
    const product = this.internationalRepo.create(data);
    return this.internationalRepo.save(product);
  }

async getAllAdmin(): Promise<InternationalProduct[]> {
  return this.internationalRepo.find({
    relations: ['product', 'orders'],
  });
}
// international-products.service.ts

  async findOne(id: number): Promise<InternationalProduct> {
    const wig = await this.internationalRepo.findOne({
      where: { id },
      relations: ['product', 'orders'], // optional
    });

    if (!wig) {
      throw new NotFoundException('Wig not found');
    }

    return wig;
  }
async findByWigId(wigId: number) {
  return this.internationalRepo.find({
    where: { product: { id: wigId } },
    relations: ['user', 'product'], // or 'customer' if you renamed it
  });
}


}
