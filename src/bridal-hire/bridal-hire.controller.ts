import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { BridalHireService } from './bridal-hire.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { cloudinaryStorage } from '../config/multer-cloudinary.config';
import * as bridalHireDto from './dto/bridal-hire.dto';

@Controller('bridal-hire')
export class BridalHireController {
  constructor(private bridalHireService: BridalHireService) {}

  /** GET all wigs (frontend Rent page) */
  @Get()
  async getAll() {
    return this.bridalHireService.getAll();
  }

  /** ADMIN: Get ALL bridal hire wigs (including non-active later if needed) */
  @Get('admin/all')
  async getAllAdmin() {
    return this.bridalHireService.getAllAdmin();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.bridalHireService.findOne(+id);
  }

  /** ADD a new bridal hire wig with image upload to Cloudinary */
  @Post('add')
  @UseInterceptors(FileInterceptor('image', { storage: cloudinaryStorage }))
  async addWig(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: bridalHireDto.CreateBridalHireWigDto,
  ) {
    // CloudinaryStorage sets file.path to the URL
    const imageUrl = file?.path;

    const wigData = {
      wigName: body.wigName,
      lengths: body.lengths.split(',').map(v => v.trim()),
      description: body.description,
      price: body.price,
      discount: body.discount,
      productId: body.productId,
      imageUrl,
    };

    return this.bridalHireService.createWig(wigData);
  }
}
