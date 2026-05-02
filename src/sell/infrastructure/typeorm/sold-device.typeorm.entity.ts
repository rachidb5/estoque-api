import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('sold_devices')
export class SoldDeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  @Index()
  data: string;

  @Column({ nullable: false })
  @Index()
  aparelho: string;

  @Column({ nullable: true })
  cor: string;

  @Column({ nullable: true })
  @Index()
  condicao: string;

  @Column({ unique: true, nullable: false })
  imei: string;

  @Column({ nullable: true })
  fornecedor: string;

  @Column('decimal', { precision: 10, scale: 2 })
  valor_compra: number;

  @Column({ nullable: false })
  @Index()
  comprador: string;

  @Column({ nullable: true })
  numero_telefone: string;

  @Column({ default: false })
  @Index()
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

  @Column({ nullable: true })
  @Index()
  vendedor_id: string;

  @Column({ nullable: true })
  vendedor_nome: string;

  @Column({ nullable: true })
  canal_venda: string;
}
