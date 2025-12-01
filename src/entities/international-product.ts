import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from './product';
import { Order } from './order';

@Entity('international_products')
export class InternationalProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.international, { nullable: false })
  @JoinColumn()
  product: Product;

  @Column()
  wigName: string; 

   @Column()
   Colour: string; 

  @Column('simple-array', { nullable: true })
  lengths: string[];

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 14 })
  deliveryDays: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Order, order => order.product)
  orders: Order[];

  @Column({ nullable: true })
  imageUrl: string;
}

