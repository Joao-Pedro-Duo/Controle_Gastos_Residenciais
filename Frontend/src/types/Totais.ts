export interface TotalPessoa {
  pessoaId: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface ResumoFinanceiro {
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

export interface ConsultaTotais {
  pessoas: TotalPessoa[]
  totalGeral: ResumoFinanceiro
}