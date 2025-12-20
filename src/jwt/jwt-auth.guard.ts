import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    console.log('🔐 Auth Guard Triggered');
    console.log('➡️ Authorization Header:', authHeader);

    if (!authHeader) {
      console.log('❌ No Authorization header found');
      return false;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('❌ Invalid Authorization format:', parts);
      return false;
    }

    const token = parts[1];
    console.log('🪪 Token received:', token);

    try {
      const payload = this.jwtService.verify(token);
      console.log('✅ Token verified. Payload:', payload);

      request['user'] = payload;
      return true;
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return false;
    }
  }
}
