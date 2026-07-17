import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { cadastrarPessoa } from '../services/pessoaService'

interface FormularioPessoaProps {
  aoCadastrar: () => Promise<void>
}

function FormularioPessoa({
  aoCadastrar,
}: FormularioPessoaProps) {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [cadastrando, setCadastrando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMensagem('')
    setErro('')

    if (nome.trim() === '') {
      setErro('Informe o nome da pessoa.')
      return
    }

   const idadeNumero = Number(idade)

    if (
      idade === '' ||
      idadeNumero < 0 ||
      !Number.isInteger(idadeNumero)
    ) {
      setErro(
        'Informe uma idade válida usando um número inteiro.',
      )
      return
    }

    try {
      setCadastrando(true)

      await cadastrarPessoa({
        nome: nome.trim(),
        idade: idadeNumero,
      })

      setNome('')
      setIdade('')
      setMensagem('Pessoa cadastrada com sucesso!')

      await aoCadastrar()
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setErro(error.message)
      } else {
        setErro('Não foi possível cadastrar a pessoa.')
      }
    } finally {
      setCadastrando(false)
    }
  }

  return (
    <section className="secao">
      <h2>Cadastrar pessoa</h2>

      <form className="formulario" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nome">Nome</label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value)
              setMensagem('')
              setErro('')
            }}
            placeholder="Digite o nome"
            required
            maxLength={100}
            autoComplete="name"
          />
        </div>

        <div className="campo">
          <label htmlFor="idade">Idade</label>

          <input
            id="idade"
            type="number"
            min="1"
            step="1"
            value={idade}
            onChange={(event) => {
              setIdade(event.target.value)
              setMensagem('')
              setErro('')
            }}
            placeholder="Digite a idade"
            required
          />
        </div>

        <button
          type="submit"
          disabled={cadastrando}
          aria-busy={cadastrando}
        >
          {cadastrando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      {mensagem && (
        <p
          className="mensagem-sucesso"
          role="status"
        >
          {mensagem}
        </p>
      )}

      {erro && (
        <p
          className="mensagem-erro"
          role="alert"
        >
          {erro}
        </p>
      )}
    </section>
  )
}

export default FormularioPessoa