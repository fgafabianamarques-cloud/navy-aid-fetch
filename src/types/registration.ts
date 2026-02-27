export interface CpfData {
  nome?: string;
  cpf?: string;
  data_nascimento?: string;
  sexo?: string;
  mae?: string;
  [key: string]: unknown;
}