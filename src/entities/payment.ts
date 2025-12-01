import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Booking } from './booking';
import { User } from './user';
import { Order } from './order';
import { SpecialOrder } from './special-order';

import {  } from 'typeorm';
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.payments, { nullable: true })
  user: User;

  @ManyToOne(() => Booking, booking => booking.payments, { nullable: true })
  booking: Booking;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'MWK' })
  currency: string;

  @Column({ unique: true })
  transactionId: string; 

  @Column({ default: 'pending' })
  status: 'pending' | 'succeeded' | 'failed';

  @Column({ default: 'paychangu' })
  method: string;

  @Column()
  type: 'bridal_hire' | 'international' | 'special'; 

  @ManyToOne(() => Order, order => order.payments, { onDelete: "CASCADE" })
  order: Order;

  @ManyToOne(() => SpecialOrder, so => so.payments, { onDelete: "CASCADE", nullable: true })
  specialOrder: SpecialOrder;


  @Column({ type: 'json', nullable: true })
  meta?: any;

  
  @CreateDateColumn()
  createdAt: Date; 

  @UpdateDateColumn()
  updatedAt: Date;

}
