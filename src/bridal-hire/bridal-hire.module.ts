import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BridalHireWig } from '../entities/bridal-hire';
import { BridalHireService } from './bridal-hire.service';
import { BridalHireController } from './bridal-hire.controller';
import { Product } from 'src/entities/product';

@Module({
  imports: [TypeOrmModule.forFeature([BridalHireWig, Product])],
  providers: [BridalHireService],
  controllers: [BridalHireController],
})
export class BridalHireModule {}
