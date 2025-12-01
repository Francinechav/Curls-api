import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// entities/setting.ts (optional)
@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  key: string;
  @Column('text')
  value: string;
}
