import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clients')
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ unique: true, nullable: false, length: 11 })
  cpf: string;

  @Column({ nullable: false })
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

  @Column({ type: 'int', default: 0 })
  total_compras: number;
}
