import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suppliers')
export class SupplierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index()
  razao_social: string;

  @Column({ nullable: true })
  @Index()
  nome_fantasia: string;

  @Column({ unique: true, nullable: false, length: 14 })
  cnpj: string;

  @Column({ nullable: false })
  @Index()
  email: string;

  @Column({ nullable: false, length: 20 })
  telefone: string;

  @Column({ nullable: true })
  endereco: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false, length: 2 })
  estado: string;

  @Column({ nullable: false, length: 8 })
  cep: string;

  @Column({ type: 'date', nullable: false })
  data_cadastro: string;
}
