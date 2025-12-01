import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { BridalHireService } from './bridal-hire.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as bridalHireDto from './dto/bridal-hire.dto';
import type { Express } from 'express';  

@Controller('bridal-hire')
export class BridalHireController {
  constructor(private bridalHireService: BridalHireService) {}

  /** GET all wigs (frontend Rent page) */
  @Get()
  async getAll() {
    return this.bridalHireService.getAll();
  }

  @Post('add')
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }),
)
async addWig(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: bridalHireDto.CreateBridalHireWigDto,
) {
  const imageUrl = file?.filename ? `/uploads/${file.filename}` : undefined;

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

/** ADMIN: Get ALL bridal hire wigs (including non-active later if needed) */
@Get('admin/all')
async getAllAdmin() {
  return this.bridalHireService.getAllAdmin();
}

@Get(':id')
async getOne(@Param('id') id: number) {
  return this.bridalHireService.findOne(+id);
}


}
