import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  modelo: string;

  @Column({ unique: true, nullable: false })
  imei: string;

  @Column({ nullable: true })
  fornecedor: string;

  @Column({ nullable: true })
  cor: string;

  @Column({ nullable: true, type: 'text' })
  observacao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_unitario: number;
}
