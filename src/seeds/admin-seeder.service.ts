import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user';

@Injectable()
export class AdminSeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("❌ No ADMIN_PASSWORD found in .env — cannot seed admin!");
      return;
    }

    const existingAdmin = await this.userRepo.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = this.userRepo.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await this.userRepo.save(admin);
    console.log("🚀 Admin created successfully!");
  }
}
