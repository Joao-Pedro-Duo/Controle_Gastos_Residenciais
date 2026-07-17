import type { Pessoa } from '../types/Pessoa'

interface ListaPessoasProps {
  pessoas: Pessoa[]
  carregando: boolean
  erro: string
  pessoaExcluindoId: number | null
  aoExcluir: (id: number, nome: string) => Promise<void>
}

function ListaPessoas({
  pessoas,
  carregando,
  erro,
  pessoaExcluindoId,
  aoExcluir,
}: ListaPessoasProps) {
  return (
    <section className="secao">
      <h2>Pessoas cadastradas</h2>

      {carregando && <p>Carregando pessoas...</p>}

      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && !erro && pessoas.length === 0 && (
        <p>Nenhuma pessoa cadastrada.</p>
      )}

      {!carregando && !erro && pessoas.length > 0 && (
        <ul className="lista-pessoas">
          {pessoas.map((pessoa) => (
            <li key={pessoa.id} className="pessoa-item">
              <div className="pessoa-dados">
                <strong>{pessoa.nome}</strong>
                <span>{pessoa.idade} anos</span>
              </div>

              <button
                type="button"
                className="botao-excluir"
                disabled={
                  pessoaExcluindoId === pessoa.id
                }
                onClick={() =>
                  aoExcluir(pessoa.id, pessoa.nome)
                }
              >
                {pessoaExcluindoId === pessoa.id
                  ? 'Excluindo...'
                  : 'Excluir'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ListaPessoas