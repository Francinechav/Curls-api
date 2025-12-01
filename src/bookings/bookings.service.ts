import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../entities/booking';
import { BlockedDate } from '../entities/blocked-date';
import { Payment } from '../entities/payment';
import { User } from '../entities/user';
import { FinalizeBookingDto } from './dto/finalize-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(BlockedDate) private blockedRepo: Repository<BlockedDate>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /** TEMP BOOKING BEFORE PAYMENT */
  async createTempBooking(body: any) {
    const { firstName, lastName, email, phoneNumber, bridalWigId, amount, bookingDate } = body;

    if (!firstName || !email || !bridalWigId || !amount) {
      throw new BadRequestException('Missing required booking info');
    }

    const txRef = `tx_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const booking = this.bookingRepo.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      bridalWig: { id: bridalWigId } as any,
      amount,
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      txRef,
    });

    await this.bookingRepo.save(booking);

    return { txRef, booking };
  }

  /** FINALIZE BOOKING AFTER PAYMENT */
  async finalizeBooking(dto: FinalizeBookingDto) {
    const payment = await this.paymentRepo.findOne({ where: { transactionId: dto.txRef }, relations: ['booking'] });
    if (!payment) throw new NotFoundException('Payment not found');

    // Only finalize if not already done
    if (payment.booking) return payment.booking;

    const booking = await this.bookingRepo.findOne({ where: { txRef: dto.txRef } });
    if (!booking) throw new NotFoundException('Booking not found');

    // Update booking with customer info
    booking.firstName = dto.firstName ?? booking.firstName;
    booking.lastName = dto.lastName ?? booking.lastName;
    booking.email = dto.email ?? booking.email;
    booking.phoneNumber = dto.phoneNumber ?? booking.phoneNumber;
    booking.status = 'confirmed';

    await this.bookingRepo.save(booking);

    // Link payment
    payment.booking = booking;
    payment.status = 'succeeded';
    await this.paymentRepo.save(payment);

    // Confirm blocked dates
    const blockedDates = await this.blockedRepo.find({ where: { txRef: dto.txRef } });
    for (const bd of blockedDates) {
      bd.booking = booking;
      bd.status = 'confirmed';
      await this.blockedRepo.save(bd);
    }

    return booking;
  }

  async getBookingByTxRef(txRef: string) {
    return this.bookingRepo.findOne({ where: { txRef }, relations: ['payments', 'blockedDates', 'bridalWig'] });
  }

  async getBlockedDatesForWig(wigId: number) {
    const blockedDates = await this.blockedRepo.createQueryBuilder('bd')
      .leftJoin('bd.booking', 'booking')
      .where('booking.bridalWig = :wigId', { wigId })
      .orWhere('bd.booking IS NULL')
      .getMany();

    return blockedDates.map(bd => ({ date: bd.date, status: bd.status, reason: bd.reason }));
  }

async findByWig(wigId: number) {
  return this.bookingRepo.find({
    where: { bridalWig: { id: wigId } },
    relations: ['user'], // to include customer info
  });
}

async getAllBookings() {
  return this.bookingRepo.find({
    relations: ['user', 'bridalWig', 'payments', 'blockedDates'],
    order: { bookingDate: 'DESC' },
  });
}


}



