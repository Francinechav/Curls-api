import { Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service'; // <-- use the wrapper
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService, // <-- now inject the wrapper
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      email: user.email,
      name: user.name,
    };
  }

  async register(data: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const newUser = await this.userService.createUser({
      name: data.name,
      email: data.email,
      password: hashed,
      role: 'customer',
    });
    return { message: 'User created', user: newUser };
  }
}
