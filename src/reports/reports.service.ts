// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user';
import { Order } from '../entities/order';
import { Payment } from '../entities/payment';
import { Booking } from '../entities/booking';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
  ) {}

  async getAdminReport() {
    // ----------------------
    // TOTALS
    // ----------------------
    const totalCustomers = await this.usersRepo.count();
    const totalBookings = await this.bookingRepo.count(); // BridalHire bookings
    const totalOrders = await this.ordersRepo.count(); // International orders

    // ----------------------
    // TOTAL REVENUE (all payments)
    // ----------------------
    const payments = await this.paymentsRepo
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .getRawOne();

    const totalRevenue = parseFloat(payments?.total || '0');

    // ----------------------
    // BOOKING GROWTH (last 6 months)
    // ----------------------
    const bookingGrowthRaw = await this.bookingRepo
      .createQueryBuilder('b')
      .select("DATE_FORMAT(b.bookingDate, '%Y-%m')", 'monthKey')
      .addSelect("MAX(DATE_FORMAT(b.bookingDate, '%b'))", 'month')
      .addSelect('COUNT(*)', 'value')
      .groupBy('monthKey')
      .orderBy('monthKey', 'ASC')
      .limit(6)
      .getRawMany();

    const bookingGrowth = bookingGrowthRaw.map((row: any) => ({
      month: row.month,
      value: parseInt(row.value, 10),
    }));

    // ----------------------
    // ORDER GROWTH (last 6 months)
    // ----------------------
    // Make sure Order entity has createdAt column:
    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // createdAt: Date;
    const orderGrowthRaw = await this.ordersRepo
      .createQueryBuilder('o')
      .select("DATE_FORMAT(o.createdAt, '%Y-%m')", 'monthKey')
      .addSelect("MAX(DATE_FORMAT(o.createdAt, '%b'))", 'month')
      .addSelect('COUNT(*)', 'value')
      .groupBy('monthKey')
      .orderBy('monthKey', 'ASC')
      .limit(6)
      .getRawMany();

    const orderGrowth = orderGrowthRaw.map((row: any) => ({
      month: row.month,
      value: parseInt(row.value, 10),
    }));

    // ----------------------
    // REVENUE GROWTH (payments last 6 months)
    // ----------------------
    const revenueGrowthRaw = await this.paymentsRepo
      .createQueryBuilder('p')
      .select("DATE_FORMAT(p.createdAt, '%Y-%m')", 'monthKey')
      .addSelect("MAX(DATE_FORMAT(p.createdAt, '%b'))", 'month')
      .addSelect('SUM(p.amount)', 'value')
      .groupBy('monthKey')
      .orderBy('monthKey', 'ASC')
      .limit(6)
      .getRawMany();

    const revenueGrowth = revenueGrowthRaw.map((row: any) => ({
      month: row.month,
      value: parseFloat(row.value),
    }));

    // ----------------------
    // RETURN REPORT
    // ----------------------
    return {
      totalCustomers,
      totalBookings,
      totalOrders,
      totalRevenue,
      bookingGrowth,
      orderGrowth,
      revenueGrowth,
    };
  }
}
