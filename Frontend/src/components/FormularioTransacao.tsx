import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { cadastrarTransacao } from '../services/transacaoService'
import type { Pessoa } from '../types/Pessoa'
import {
  TipoTransacao,
  type TipoTransacao as TipoTransacaoType,
} from '../types/Transacao'

interface FormularioTransacaoProps {
  pessoas: Pessoa[]
  aoCadastrar: () => Promise<void>
}

function FormularioTransacao({
  pessoas,
  aoCadastrar,
}: FormularioTransacaoProps) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<TipoTransacaoType>(
    TipoTransacao.Despesa,
  )
  const [pessoaId, setPessoaId] = useState('')
  const [cadastrando, setCadastrando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setMensagem('')
    setErro('')

    if (descricao.trim() === '') {
      setErro('Informe a descrição da transação.')
      return
    }

    const valorNumero = Number(valor)

    if (
      valor === '' ||
      !Number.isFinite(valorNumero) ||
      valorNumero <= 0
    ) {
      setErro('Informe um valor maior que zero.')
      return
    }

    if (pessoaId === '') {
      setErro('Selecione uma pessoa.')
      return
    }

    try {
      setCadastrando(true)

      await cadastrarTransacao({
        descricao: descricao.trim(),
        valor: valorNumero,
        tipo,
        pessoaId: Number(pessoaId),
      })

      setDescricao('')
      setValor('')
      setTipo(TipoTransacao.Despesa)
      setPessoaId('')
      setMensagem('Transação cadastrada com sucesso!')

      await aoCadastrar()
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setErro(error.message)
      } else {
        setErro('Não foi possível cadastrar a transação.')
      }
    } finally {
      setCadastrando(false)
    }
  }

  return (
    <section className="secao">
      <h2>Cadastrar transação</h2>

      {pessoas.length === 0 ? (
        <p>
          Cadastre uma pessoa antes de adicionar transações.
        </p>
      ) : (
        <form className="formulario" onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="descricao">Descrição</label>

           <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(event) => {
                setDescricao(event.target.value)
                setMensagem('')
                setErro('')
              }}
              placeholder="Ex.: Conta de energia"
              required
              maxLength={150}
            />
          </div>

          <div className="campo">
            <label htmlFor="valor">Valor</label>

            <input
              id="valor"
              type="number"
              min="0.01"
              step="0.01"
              value={valor}
              onChange={(event) => {
                setValor(event.target.value)
                setMensagem('')
                setErro('')
              }}
              placeholder="0,00"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="tipo">Tipo</label>

            <select
              id="tipo"
              value={tipo}
              onChange={(event) => {
                setTipo(
                  Number(event.target.value) as TipoTransacaoType,
                )

                setMensagem('')
                setErro('')
              }}
              required
            >
              <option value={TipoTransacao.Receita}>
                Receita
              </option>

              <option value={TipoTransacao.Despesa}>
                Despesa
              </option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="pessoa-transacao">
              Pessoa
            </label>

            <select
              id="pessoa-transacao"
              value={pessoaId}
              onChange={(event) => {
                setPessoaId(event.target.value)
                setMensagem('')
                setErro('')
              }}
              required
            >
              <option value="">
                Selecione uma pessoa
              </option>

              {pessoas.map((pessoa) => (
                <option
                  key={pessoa.id}
                  value={pessoa.id}
                >
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={cadastrando}>
            {cadastrando
              ? 'Cadastrando...'
              : 'Cadastrar transação'}
          </button>
        </form>
      )}

      {mensagem && (
        <p className="mensagem-sucesso">{mensagem}</p>
      )}

      {erro && <p className="mensagem-erro">{erro}</p>}
    </section>
  )
}

export default FormularioTransacao