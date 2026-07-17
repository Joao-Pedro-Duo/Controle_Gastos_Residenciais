import type { CriarPessoa, Pessoa } from '../types/Pessoa'

const API_URL = import.meta.env.VITE_API_URL

export async function listarPessoas(): Promise<Pessoa[]> {
  const resposta = await fetch(`${API_URL}/api/pessoas`)

  if (!resposta.ok) {
    throw new Error('Não foi possível carregar as pessoas.')
  }

  const pessoas: Pessoa[] = await resposta.json()

  return pessoas
}

export async function cadastrarPessoa(
  novaPessoa: CriarPessoa,
): Promise<Pessoa> {
  const resposta = await fetch(`${API_URL}/api/pessoas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(novaPessoa),
  })

  if (!resposta.ok) {
    const mensagem = await resposta.text()

    throw new Error(mensagem || 'Não foi possível cadastrar a pessoa.')
  }

  const pessoaCadastrada: Pessoa = await resposta.json()

  return pessoaCadastrada
}

export async function excluirPessoa(id: number): Promise<void> {
  const resposta = await fetch(`${API_URL}/api/pessoas/${id}`, {
    method: 'DELETE',
  })

  if (!resposta.ok) {
    const mensagem = await resposta.text()

    throw new Error(mensagem || 'Não foi possível excluir a pessoa.')
  }
}