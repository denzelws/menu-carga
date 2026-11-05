// Contratos espelhados do backend (menucarga.api.*). Fonte da verdade: testes de integração.
export interface NovaConcessao {
  pessoa: string;
  modulo: string;
  path: string;
  direito: string;
}

export interface PermissaoResponse {
  permitido: boolean;
}

export interface ErroDeLinha {
  line: number;
  message: string;
}

export interface ResultadoCarga {
  persisted: number;
  errors: ErroDeLinha[];
}

export interface ErroArquivo {
  error: string;
}

export const PATH_MODULOS_MENU = '/modulos/menu';
export const DIREITO_ACESSO = 'ACESSO';
/** Espelha `concessao.pessoa` varchar(255) da V1. */
export const MAX_PESSOA = 255;
/** Espelha `concessao.modulo` varchar(255) da V1. */
export const MAX_MODULO = 255;
