import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('stock')
export class StockEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index()
  modelo: string;

  @Column({ unique: true, nullable: false })
  imei: string;

  @Column({ nullable: true })
  @Index()
  fornecedor: string;

  @Column({ nullable: true })
  @Index()
  cor: string;

  @Column({ nullable: true, type: 'text' })
  observacao: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_unitario: number;
}
