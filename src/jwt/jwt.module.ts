import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtService, JwtAuthGuard],
  exports: [JwtService, JwtAuthGuard],
})
export class JwtModule {}
