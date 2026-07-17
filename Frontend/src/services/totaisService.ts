import type { ConsultaTotais } from '../types/Totais'

const API_URL = import.meta.env.VITE_API_URL

export async function consultarTotais(): Promise<ConsultaTotais> {
  const resposta = await fetch(`${API_URL}/api/totais`)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar os totais.')
  }

  const totais: ConsultaTotais = await resposta.json()

  return totais
}