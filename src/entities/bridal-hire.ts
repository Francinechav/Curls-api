import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product';
import { Booking } from './booking';

@Entity('bridal_hire_wigs')
export class BridalHireWig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wigName: string;

  @Column('simple-array', { nullable: true })
  lengths: string[];

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: true })
  imageUrl: string; // ✅ Image now stored here

  @OneToMany(() => Booking, booking => booking.bridalWig)
  bookings: Booking[];

@ManyToOne(() => Product, (product) => product.bridalHire)
@JoinColumn({ name: 'productId' })
product: Product;


}
