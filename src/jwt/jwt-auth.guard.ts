import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
