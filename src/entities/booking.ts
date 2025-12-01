import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Payment } from './payment';
import { BlockedDate } from './blocked-date';
import { BridalHireWig } from './bridal-hire';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings, { nullable: true })
  user: User;

  @ManyToOne(() => BridalHireWig, wig => wig.bookings)
  bridalWig: BridalHireWig;

  @Column('date')
  bookingDate: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled';

  @Column({ unique: true })
  txRef: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];

  @OneToMany(() => BlockedDate, bd => bd.booking)
  blockedDates: BlockedDate[];
}
