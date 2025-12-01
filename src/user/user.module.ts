import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '../jwt/jwt.module'; // <-- import the JWT module

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
