import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InternationalProductsService } from './international-product.service';
import { Product } from 'src/entities/product';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('international-products')
export class InternationalProductsController {
  constructor(
    private readonly productsService: InternationalProductsService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>, // <-- inject here
  ) {}

  @Get()
  async getAll() {
    return this.productsService.getAllActiveProducts();
  }

  // NEW: Upload international product with image
  @Post('upload')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),
  }),
)
async uploadProduct(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: {
    wigName: string;
    Colour: string;
    lengths: string;
    price: string;
    description?: string;
    productId: number;
       // must exist in products table
  },
) {
  const lengthsArray = body.lengths ? body.lengths.split(',').map(s => s.trim()) : [];

  // IMPORTANT: fetch the existing product from DB
  const product = await this.productRepository.findOne({ where: { id: body.productId, type: 'international' } });
  if (!product) {
    throw new Error('Product not found or not international type');
  }

  return this.productsService.createProduct({
    wigName: body.wigName,
    Colour: body.Colour, 
    lengths: lengthsArray,
    price: parseFloat(body.price),
    description: body.description,
    imageUrl: file ? `/uploads/${file.filename}` : undefined,
    active: true,
    product: product,
  });
}

/** ADMIN: Get ALL international wigs (active + inactive) */
@Get('admin/all')
async getAllAdmin() {
  return this.productsService.getAllAdmin();
}

// international-products.controller.ts

@Get(':id')
async getOne(@Param('id') id: number) {
  return this.productsService.findOne(id);
}

// orders.controller.ts

@Get('by-wig/:wigId')
async getByWig(@Param('wigId') wigId: number) {
  return this.productsService.findByWigId(wigId);
}


}
