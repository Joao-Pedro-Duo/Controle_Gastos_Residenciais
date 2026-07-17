export const TipoTransacao = {
  Receita: 0,
  Despesa: 1,
} as const

export type TipoTransacao =
  (typeof TipoTransacao)[keyof typeof TipoTransacao]

export interface Transacao {
  id: number
  descricao: string
  valor: number
  tipo: TipoTransacao
  pessoaId: number
}

export interface CriarTransacao {
  descricao: string
  valor: number
  tipo: TipoTransacao
  pessoaId: number
}