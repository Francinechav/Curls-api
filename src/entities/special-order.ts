import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { Payment } from './payment';

export type Texture = 'body_wave' | 'straight' | 'water_wave' | 'kinky';

@Entity('special_orders')
export class SpecialOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders, { nullable: true })
  user?: User;

  @Column({ type: 'varchar' })
  texture: Texture;

  @Column({ type: 'varchar' })
  colour: string;

  @Column({ type: 'varchar' })
  length: string; // keep string so you can store "12", "14/16" etc.

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  depositAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balanceAmount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'cancelled';

  @Column({ default: false })
doubleDrawn: boolean;

@Column({ default: false })
highlight: boolean;

@Column({ type: 'text', nullable: true })
comments?: string;


  @Column({ type: 'int', default: 14 })
deliveryWindowDays: number;


  @Column({ nullable: true, unique: true })
  txRef?: string;

  @Column({ nullable: true })
  first_name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
 district?: string;


  @OneToMany(() => Payment, payment => payment.specialOrder)
payments?: Payment[];

  @CreateDateColumn()
  createdAt: Date;
}
