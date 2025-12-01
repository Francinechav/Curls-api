import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking';
import { Order } from './order';
import { Payment } from './payment';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'customer' })
  role: 'customer' | 'admin' ;

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];
}
