import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PriceTier } from './price-tier';

@Entity('textures')
export class Texture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string; // e.g. 'straight', 'body_wave', 'water_wave', 'kinky'

  @Column()
  name: string; // human name

  @OneToMany(() => PriceTier, (pt) => pt.texture)
  priceTiers?: PriceTier[];
}
