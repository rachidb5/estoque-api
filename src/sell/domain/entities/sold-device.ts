export class SoldDevice {
  id: number;
  data: string;
  aparelho: string;
  cor?: string;
  condicao?: string;
  imei: string;
  fornecedor?: string;
  valor_compra: number;
  comprador: string;
  numero_telefone?: string;
  aparelho_recebido: boolean;
  observacao?: string;
  valor_recebido: number;
  preco_vista: number;
  preco_cartao: number;
  valor_entrega: number;
  valor_capa_pelicula: number;
  valor_total_venda: number;
  vendedor_id?: string;
  vendedor_nome?: string;
  canal_venda?: string;
}
