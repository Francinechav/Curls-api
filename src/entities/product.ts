import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { BridalHireWig } from './bridal-hire';
import { InternationalProduct } from './international-product';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'bridal_hire' })
  type: 'bridal_hire' | 'international';

  // Relationships to detail tables
  @OneToMany(() => BridalHireWig, bridal => bridal.product)
  bridalHire?: BridalHireWig;

  @OneToMany(() => InternationalProduct, intl => intl.product)
  international?: InternationalProduct;
}
