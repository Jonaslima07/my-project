export interface IVenda {
    numPedido?: number; // Agora é opcional
    nome: string;
    produto: string;
    valor: number;
    data?: Date;
    localizacao?: string;
  }
  