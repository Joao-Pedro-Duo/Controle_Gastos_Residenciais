import { useCallback, useEffect, useState } from 'react'
import './App.css'

import FormularioPessoa from './components/FormularioPessoa'
import ListaPessoas from './components/ListaPessoas'
import FormularioTransacao from './components/FormularioTransacao'
import ListaTransacoes from './components/ListaTransacoes'
import ResumoFinanceiro from './components/ResumoFinanceiro'

import {
  excluirPessoa,
  listarPessoas,
} from './services/pessoaService'

import {
  listarTransacoes,
} from './services/transacaoService'

import { consultarTotais } from './services/totaisService'

import type { Pessoa } from './types/Pessoa'
import type { Transacao } from './types/Transacao'
import type { ConsultaTotais } from './types/Totais'

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [mensagemPessoa, setMensagemPessoa] = useState('')
  const [pessoaExcluindoId, setPessoaExcluindoId] =
    useState<number | null>(null)

  const [transacoes, setTransacoes] =
    useState<Transacao[]>([])

  const [
    carregandoTransacoes,
    setCarregandoTransacoes,
  ] = useState(true)

  const [
    erroListagemTransacoes,
    setErroListagemTransacoes,
  ] = useState('')

  const [totais, setTotais] =
    useState<ConsultaTotais | null>(null)

  const [carregandoTotais, setCarregandoTotais] =
    useState(true)

  const [erroTotais, setErroTotais] = useState('')

  const carregarPessoas = useCallback(async () => {
    try {
      setCarregando(true)
      setErro('')

      const dados = await listarPessoas()

      setPessoas(dados)
    } catch (error) {
      console.error(error)

      setErro('Não foi possível carregar as pessoas.')
    } finally {
      setCarregando(false)
    }
  }, [])

  const carregarTransacoes = useCallback(async () => {
    try {
      setCarregandoTransacoes(true)
      setErroListagemTransacoes('')

      const dados = await listarTransacoes()

      setTransacoes(dados)
    } catch (error) {
      console.error(error)

      setErroListagemTransacoes(
        'Não foi possível carregar as transações.',
      )
    } finally {
      setCarregandoTransacoes(false)
    }
  }, [])

  const carregarTotais = useCallback(async () => {
    try {
      setCarregandoTotais(true)
      setErroTotais('')

      const dados = await consultarTotais()

      setTotais(dados)
    } catch (error) {
      console.error(error)

      setErroTotais(
        'Não foi possível carregar os totais financeiros.',
      )
    } finally {
      setCarregandoTotais(false)
    }
  }, [])

  useEffect(() => {
  async function carregarDadosIniciais() {
    try {
      const [
        dadosPessoas,
        dadosTransacoes,
        dadosTotais,
      ] = await Promise.all([
        listarPessoas(),
        listarTransacoes(),
        consultarTotais(),
      ])

      setPessoas(dadosPessoas)
      setTransacoes(dadosTransacoes)
      setTotais(dadosTotais)
    } catch (error) {
      console.error(error)

      setErro(
        'Não foi possível carregar os dados iniciais.',
      )
    } finally {
      setCarregando(false)
      setCarregandoTransacoes(false)
      setCarregandoTotais(false)
    }
  }

  carregarDadosIniciais()
}, [])

  async function atualizarAposCadastrarPessoa() {
    setMensagemPessoa('')

    await Promise.all([
      carregarPessoas(),
      carregarTotais(),
    ])
  }

  async function atualizarAposCadastrarTransacao() {
    await Promise.all([
      carregarTransacoes(),
      carregarTotais(),
    ])
  }

  async function handleExcluirPessoa(
    id: number,
    nome: string,
  ) {
    const confirmou = window.confirm(
      `Deseja realmente excluir ${nome}?`,
    )

    if (!confirmou) {
      return
    }

    try {
      setErro('')
      setMensagemPessoa('')
      setPessoaExcluindoId(id)

      await excluirPessoa(id)

      await Promise.all([
        carregarPessoas(),
        carregarTransacoes(),
        carregarTotais(),
      ])

      setMensagemPessoa(
        'Pessoa excluída com sucesso!',
      )
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setErro(error.message)
      } else {
        setErro(
          'Não foi possível excluir a pessoa.',
        )
      }
    } finally {
      setPessoaExcluindoId(null)
    }
  }

  return (
    <main className="container">
      <h1 className="titulo">
        Controle de Gastos Residenciais
      </h1>

      <p className="subtitulo">
        Gerencie pessoas, transações e totais financeiros.
      </p>

      <ResumoFinanceiro
        totais={totais}
        carregando={carregandoTotais}
        erro={erroTotais}
      />

      <FormularioPessoa
        aoCadastrar={atualizarAposCadastrarPessoa}
      />

      <ListaPessoas
        pessoas={pessoas}
        carregando={carregando}
        erro={erro}
        pessoaExcluindoId={pessoaExcluindoId}
        aoExcluir={handleExcluirPessoa}
      />

      {mensagemPessoa && (
        <p
          className="mensagem-sucesso mensagem-global"
          role="status"
        >
          {mensagemPessoa}
        </p>
      )}

      <FormularioTransacao
        pessoas={pessoas}
        aoCadastrar={atualizarAposCadastrarTransacao}
      />

      <ListaTransacoes
        transacoes={transacoes}
        pessoas={pessoas}
        carregando={carregandoTransacoes}
        erro={erroListagemTransacoes}
      />
    </main>
  )
}

export default App