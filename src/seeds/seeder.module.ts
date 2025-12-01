import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSeederService } from './admin-seeder.service';
import { User } from '../entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminSeederService],
  exports: [AdminSeederService],
})
export class SeederModule {}
