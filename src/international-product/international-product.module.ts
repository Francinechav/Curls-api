import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternationalProductsController } from './international-product.controller';
import { InternationalProductsService } from './international-product.service';
import { InternationalProduct } from '../entities/international-product';
import { Product } from '../entities/product'; // <-- ADD THIS

@Module({
  imports: [
    TypeOrmModule.forFeature([InternationalProduct, Product]), // <-- ADD Product here
  ],
  controllers: [InternationalProductsController],
  providers: [InternationalProductsService],
})
export class InternationalProductsModule {}
