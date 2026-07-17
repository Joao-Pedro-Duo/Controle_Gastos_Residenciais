import type {
  CriarTransacao,
  Transacao,
} from '../types/Transacao'

const API_URL = import.meta.env.VITE_API_URL

export async function listarTransacoes(): Promise<Transacao[]> {
  const resposta = await fetch(`${API_URL}/api/transacoes`)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as transações.')
  }

  const transacoes: Transacao[] = await resposta.json()

  return transacoes
}

export async function cadastrarTransacao(
  novaTransacao: CriarTransacao,
): Promise<Transacao> {
  const resposta = await fetch(`${API_URL}/api/transacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novaTransacao),
  })

  if (!resposta.ok) {
    const mensagem = await resposta.text()

    throw new Error(
      mensagem || 'Não foi possível cadastrar a transação.',
    )
  }

  const transacaoCadastrada: Transacao =
    await resposta.json()

  return transacaoCadastrada
}