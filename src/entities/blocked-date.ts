import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from './booking';

@Entity('blocked_dates')
export class BlockedDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'blocked';

  @Column({ nullable: true })
  txRef: string;

  @ManyToOne(() => Booking, booking => booking.blockedDates, { nullable: true })
  booking: Booking;

  @Column({ nullable: true })
  reason?: string;
}
