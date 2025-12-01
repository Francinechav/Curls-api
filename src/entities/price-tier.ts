import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Texture } from './texture';

@Entity('price_tiers')
export class PriceTier {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Texture, (t) => t.priceTiers, { onDelete: 'CASCADE' })
  texture: Texture;

  @Column({ type: 'int' })
  lengthInches: number; // e.g. 12, 14, 16

  @Column('decimal', { precision: 12, scale: 2 })
  price: number; // price in MWK
}
