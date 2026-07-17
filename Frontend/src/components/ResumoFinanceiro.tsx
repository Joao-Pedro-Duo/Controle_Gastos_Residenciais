import type { ConsultaTotais } from '../types/Totais'

interface ResumoFinanceiroProps {
  totais: ConsultaTotais | null
  carregando: boolean
  erro: string
}

function ResumoFinanceiro({
  totais,
  carregando,
  erro,
}: ResumoFinanceiroProps) {
  function formatarMoeda(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <section className="secao">
      <h2>Resumo financeiro</h2>

      {carregando && (
        <p>Carregando totais financeiros...</p>
      )}

      {erro && (
        <p className="mensagem-erro">{erro}</p>
      )}

      {!carregando && !erro && totais && (
        <>
          <div className="cards-totais">
            <article className="card-total">
              <span>Total de receitas</span>

              <strong className="valor-receita">
                {formatarMoeda(
                  totais.totalGeral.totalReceitas,
                )}
              </strong>
            </article>

            <article className="card-total">
              <span>Total de despesas</span>

              <strong className="valor-despesa">
                {formatarMoeda(
                  totais.totalGeral.totalDespesas,
                )}
              </strong>
            </article>

            <article className="card-total">
              <span>Saldo geral</span>

              <strong
                className={
                  totais.totalGeral.saldo >= 0
                    ? 'valor-receita'
                    : 'valor-despesa'
                }
              >
                {formatarMoeda(
                  totais.totalGeral.saldo,
                )}
              </strong>
            </article>
          </div>

          <h3 className="titulo-totais-pessoa">
            Totais por pessoa
          </h3>

          {totais.pessoas.length === 0 ? (
            <p>Nenhuma pessoa cadastrada.</p>
          ) : (
            <ul className="lista-totais-pessoa">
              {totais.pessoas.map((pessoa) => (
                <li
                  key={pessoa.pessoaId}
                  className="total-pessoa-item"
                >
                  <strong>{pessoa.nome}</strong>

                  <div className="total-pessoa-valores">
                    <span>
                      Receitas:{' '}
                      <strong className="valor-receita">
                        {formatarMoeda(
                          pessoa.totalReceitas,
                        )}
                      </strong>
                    </span>

                    <span>
                      Despesas:{' '}
                      <strong className="valor-despesa">
                        {formatarMoeda(
                          pessoa.totalDespesas,
                        )}
                      </strong>
                    </span>

                    <span>
                      Saldo:{' '}
                      <strong
                        className={
                          pessoa.saldo >= 0
                            ? 'valor-receita'
                            : 'valor-despesa'
                        }
                      >
                        {formatarMoeda(pessoa.saldo)}
                      </strong>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default ResumoFinanceiro