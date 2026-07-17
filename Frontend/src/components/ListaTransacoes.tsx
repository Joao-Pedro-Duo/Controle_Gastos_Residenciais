import type { Pessoa } from '../types/Pessoa'
import {
  TipoTransacao,
  type Transacao,
} from '../types/Transacao'

interface ListaTransacoesProps {
  transacoes: Transacao[]
  pessoas: Pessoa[]
  carregando: boolean
  erro: string
}

function ListaTransacoes({
  transacoes,
  pessoas,
  carregando,
  erro,
}: ListaTransacoesProps) {
  function obterNomePessoa(pessoaId: number) {
    const pessoaEncontrada = pessoas.find(
      (pessoa) => pessoa.id === pessoaId,
    )

    return pessoaEncontrada?.nome ?? 'Pessoa não encontrada'
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <section className="secao">
      <h2>Transações cadastradas</h2>

      {carregando && <p>Carregando transações...</p>}

      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && !erro && transacoes.length === 0 && (
        <p>Nenhuma transação cadastrada.</p>
      )}

      {!carregando && !erro && transacoes.length > 0 && (
        <ul className="lista-transacoes">
          {transacoes.map((transacao) => (
            <li
              key={transacao.id}
              className="transacao-item"
            >
              <div className="transacao-informacoes">
                <strong>{transacao.descricao}</strong>

                <span>
                  {obterNomePessoa(transacao.pessoaId)}
                </span>
              </div>

              <div className="transacao-valores">
                <span
                  className={
                    transacao.tipo ===
                    TipoTransacao.Receita
                      ? 'tipo-receita'
                      : 'tipo-despesa'
                  }
                >
                  {transacao.tipo ===
                  TipoTransacao.Receita
                    ? 'Receita'
                    : 'Despesa'}
                </span>

                <strong>
                  {formatarMoeda(transacao.valor)}
                </strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaTransacoes