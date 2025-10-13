export type OrigemDados = 'GOVERNO' | 'MANUAL';

export interface NCM {
  id: number;
  codigo: string;
  codigoFormatado?: string; // Código formatado com pontos (ex: 0102.21.10)
  descricao: string;
  dataInicio: string;
  dataFim: string;
  tipoAtoIni: string;
  numeroAtoIni: string;
  anoAtoIni: string;
  origem: OrigemDados;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NBS {
  id: number;
  codigo: string;
  codigoFormatado?: string; // Código formatado com pontos (ex: 1.109.05.21)
  descricao: string;
  versao: string;
  origem: OrigemDados;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NCMListResponse {
  itens: NCM[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NBSListResponse {
  itens: NBS[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ImportResult {
  total: number;
  importados: number;
  atualizados: number;
}

export interface NCMFilters {
  search?: string;
  origem?: OrigemDados;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

export interface NBSFilters {
  search?: string;
  origem?: OrigemDados;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateNCMDto {
  codigo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  tipoAtoIni: string;
  numeroAtoIni: string;
  anoAtoIni: string;
}

export interface UpdateNCMDto {
  codigo?: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  tipoAtoIni?: string;
  numeroAtoIni?: string;
  anoAtoIni?: string;
  ativo?: boolean;
}

export interface CreateNBSDto {
  codigo: string;
  descricao: string;
  versao?: string;
}

export interface UpdateNBSDto {
  codigo?: string;
  descricao?: string;
  versao?: string;
  ativo?: boolean;
}

// CST (Código de Situação Tributária)
export interface CST {
  id: number;
  idGoverno: number;
  codigo: string;
  descricao: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CSTListResponse {
  itens: CST[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CSTFilters {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
}

// Classificação Tributária
export interface ClassificacaoTributaria {
  id: number;
  idSituacaoTributaria: number;
  cst: string;
  codigo: string;
  descricao: string;
  dataReferencia: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassificacaoTributariaListResponse {
  itens: ClassificacaoTributaria[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClassificacaoTributariaFilters {
  search?: string;
  cst?: string;
  page?: number;
  limit?: number;
}
