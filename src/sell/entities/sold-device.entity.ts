import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sold_devices')
export class SoldDevice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  data: string;

  @Column({ nullable: false })
  aparelho: string;

  @Column({ nullable: true })
  cor: string;

  @Column({ nullable: true })
  condicao: string;

  @Column({ unique: true, nullable: false })
  imei: string;

  @Column({ nullable: true })
  fornecedor: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_compra: number;

  @Column({ nullable: false })
  comprador: string;

  @Column({ nullable: true })
  numero_telefone: string;

  @Column({ default: false })
  aparelho_recebido: boolean;

  @Column({ type: 'text', nullable: true })
  observacao: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valor_recebido: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_vista: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_cartao: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valor_entrega: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valor_capa_pelicula: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  valor_total_venda: number;
}