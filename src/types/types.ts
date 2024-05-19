import { FieldError, FieldValues } from "react-hook-form";

// Interfaces

export interface Carrier {
  codtrans: string;
  nome: string;
  inscest: string;
  cnpj: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone1: string;
  obs: string;
  email: string;
  id_pedido: number;
  fax: string;
  telefone2: string;
  contato: string;
}

export interface CommonInformations {
  qtdped: number;
  qtdmin: number;
  custo: number;
  margem: number;
  qtdcorte: number;
  qtdest: number;
  referencia: string;
  modelo: string;
  descr1: string;
  descr2: string;
  caract1: string;
  caract2: string;
  caract3: string;
  caract4: string;
  tempo: number;
  ciclo: number;
  peso: number;
  largura: number;
  comprimen: number;
  altura: number;
  codleader: string;
  codmarisa: string;
  codhanes: string;
  codvaliser: string;
  lote: number;
  kit: number;
  kitqtd: number;
  basecusto: number;
  meta1: number;
  meta2: number;
  meta3: number;
  meta4: number;
  meta5: number;
  meta6: number;
  meta7: number;
  meta8: number;
  meta9: number;
  meta10: number;
  meta11: number;
  meta12: number;
  meta13: number;
  meta14: number;
  meta15: number;
  venda1: number;
  venda2: number;
  venda3: number;
  venda4: number;
  venda5: number;
  venda6: number;
  venda7: number;
  venda8: number;
  venda9: number;
}

export interface PriceReference {
  tipopreco: string;
  referencia: string;
}

export interface PaymentMethod {
  descricao: string;
  qtdparc: number;
  ddparc1: number;
  ddparc2: number;
  ddparc3: number;
  ddparc4: number;
  ddparc5: number;
  ddparc6: number;
  ddparc7: number;
  ddparc8: number;
  ddparc9: number;
  ddparc10: number;
  id: number;
}

export interface FormaPagRep {
  id_representante: number;
  id_formapag: number;
}

export interface Color {
  id: number;
  descricao: string;
  cor: string;
}

export interface Tissue {
  id: number;
  tecido: string;
}

export interface Collection {
  id: number;
  nome_colecao: string;
}

export interface Size {
  label: string;
  tamanhos: string[];
}

export interface FormattedSizes {
  alfa: Size;
  numerica: Size;
  especial: Size;
}

export interface DocumentationPage {
  name: string;
  fields: string[];
  tags: string[];
  pathname: string;
}

// Types

export type FormFieldErrors<FormData extends FieldValues> = {
  [K in keyof FormData]?: FieldError;
};

export type Price = string;

export type ClientKeys =
  | "email"
  | "nome"
  | "fantasia"
  | "endereco"
  | "complemento"
  | "bairro"
  | "cidade"
  | "uf"
  | "cep"
  | "telefone1"
  | "telefone2"
  | "fax"
  | "cpf"
  | "cnpj"
  | "inscest"
  | "inscmun"
  | "obs"
  | "representative_id"
  | "duplacon";

export type RepresentativeKeys =
  | "nome"
  | "endereco"
  | "bairro"
  | "cidade"
  | "uf"
  | "cep"
  | "email"
  | "telefone1"
  | "telefone2"
  | "telefone3"
  | "cpf"
  | "identidade"
  | "aparece_nos_relatorios"
  | "comissao"
  | "meta"
  | "observacao"
  | "razao"
  | "cnpj"
  | "banco"
  | "agencia"
  | "conta"
  | "area"
  | "chavepix"
  | "tipochave"
  | "bloqueado";

// * Others

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
