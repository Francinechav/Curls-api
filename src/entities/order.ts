import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Payment } from './payment';
import { InternationalProduct } from './international-product';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  depositAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balanceAmount: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing'| 'completed';


  @OneToMany(() => Payment, payment => payment.order)
  payments: Payment[];
  @ManyToOne(() => InternationalProduct, product => product.orders, { nullable: true }) 
  product: InternationalProduct;


  @Column({ nullable: true })
  first_name: string;

@Column({ nullable: true })
last_name: string;

@Column({ nullable: true })
email: string;

@Column({ nullable: true })
phoneNumber: string;

@Column({ nullable: true })
district: string;



@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
createdAt: Date;
   
}
