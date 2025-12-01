// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getAdminById(id: number): Promise<{ name: string; email: string }> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    if (user.role !== 'admin') throw new Error('Forbidden');

    return { name: user.name, email: user.email };
  }


  async findByEmail(email: string): Promise<User | null> {
  return this.userRepo.findOne({ where: { email } });
}


  async createUser(data: Partial<User>) {
  const user = this.userRepo.create(data);
  return this.userRepo.save(user);
}

}
