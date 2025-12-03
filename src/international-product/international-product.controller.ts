import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternationalProductsService } from './international-product.service';
import { Product } from 'src/entities/product';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cloudinaryStorage } from '../config/multer-cloudinary.config';

@Controller('international-products')
export class InternationalProductsController {
  constructor(
    private readonly productsService: InternationalProductsService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /** Get all active international products */
  @Get()
  async getAll() {
    return this.productsService.getAllActiveProducts();
  }

  /** Upload international product with image to Cloudinary */
  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { storage: cloudinaryStorage }))
  async uploadProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      wigName: string;
      Colour: string;
      lengths: string;
      price: string;
      description?: string;
      productId: number;
    },
  ) {
    const lengthsArray = body.lengths.split(',').map(s => s.trim());
    const imageUrl = file?.path;

    // Verify product exists and is international
    const product = await this.productRepository.findOne({ where: { id: body.productId, type: 'international' } });
    if (!product) throw new Error('Product not found');

    return this.productsService.createProduct({
      wigName: body.wigName,
      Colour: body.Colour,
      lengths: lengthsArray,
      price: parseFloat(body.price),
      description: body.description,
      imageUrl,
      active: true,
      product,
    });
  }

  /** ADMIN: Get all international wigs */
  @Get('admin/all')
  async getAllAdmin() {
    return this.productsService.getAllAdmin();
  }

  /** Get single international product by ID */
  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  /** Get orders by wig ID */
  @Get('by-wig/:wigId')
  async getByWig(@Param('wigId') wigId: number) {
    return this.productsService.findByWigId(wigId);
  }
}
