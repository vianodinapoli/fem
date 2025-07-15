'use client'

import { useState, useEffect, useRef } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import RegistroForm from './RegistroForm'
import { excluirRegistro } from '../actions/delete'
import ExportButtons from './ExportButtons'
import Modal from '../components/Modal'

// Tipagem

type Registro = {
  id: number
  data: string
  codigo: string
  quantidade: number
  descricao: string
  observacao: string
  estado: string
}

type SortKey = keyof Registro

export default function RegistroList({ registros }: { registros: Registro[] }) {
  const [modoEdicao, setModoEdicao] = useState(false)
  const [registroSelecionado, setRegistroSelecionado] = useState<Registro | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('data')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filtro, setFiltro] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const porPagina = 19
  const [registroParaExcluir, setRegistroParaExcluir] = useState<Registro | null>(null)
  const [ultimaAtualizacao, setUltimaAtualizacaoState] = useState<Date | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('ultimaAtualizacao')
    if (saved) {
      setUltimaAtualizacaoState(new Date(saved))
    }
  }, [])

  function setUltimaAtualizacao(date: Date) {
    setUltimaAtualizacaoState(date)
    localStorage.setItem('ultimaAtualizacao', date.toISOString())
  }

  const corEstado = {
    Novo: 'bg-green-100 text-green-800',
    Bom: 'bg-blue-100 text-blue-800',
    Danificado: 'bg-red-100 text-red-800',
  }

  const ordenar = (chave: SortKey) => {
    if (chave === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(chave)
      setSortOrder('asc')
    }
  }

  const registrosFiltrados = registros.filter((r) => {
    const termo = filtro.toLowerCase()
    return (
      r.codigo.toLowerCase().includes(termo) ||
      r.descricao.toLowerCase().includes(termo) ||
      r.observacao?.toLowerCase().includes(termo)
    )
  })

  const registrosOrdenados = [...registrosFiltrados].sort((a, b) => {
    const valorA = a[sortKey]
    const valorB = b[sortKey]

    if (typeof valorA === 'number' && typeof valorB === 'number') {
      return sortOrder === 'asc' ? valorA - valorB : valorB - valorA
    }

    if (typeof valorA === 'string' && typeof valorB === 'string') {
      if (sortKey === 'data') {
        return sortOrder === 'asc'
          ? new Date(valorA).getTime() - new Date(valorB).getTime()
          : new Date(valorB).getTime() - new Date(valorA).getTime()
      }
      return sortOrder === 'asc'
        ? valorA.localeCompare(valorB)
        : valorB.localeCompare(valorA)
    }

    return 0
  })

  const totalPaginas = Math.ceil(registrosOrdenados.length / porPagina)
  const registrosPaginados = registrosOrdenados.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina
  )

  const seta = (coluna: SortKey) => {
    if (coluna !== sortKey) return ''
    return sortOrder === 'asc' ? '🔼' : '🔽'
  }

  function iniciarEdicao(registro: Registro) {
    setRegistroSelecionado(registro)
    setModoEdicao(true)
  }

  function cancelarEdicao() {
    setRegistroSelecionado(null)
    setModoEdicao(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">
        {modoEdicao ? 'Editar Item' : 'FEM - DONDO - STOCK'}
      </h1>

      <RegistroForm
        initial={registroSelecionado}
        modoEdicao={modoEdicao}
        setModoEdicao={setModoEdicao}
        setRegistro={setRegistroSelecionado}
        setUltimaAtualizacao={setUltimaAtualizacao}
      />

      {modoEdicao && (
        <button
          onClick={cancelarEdicao}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancelar edição
        </button>
      )}

      <ExportButtons registros={registrosFiltrados} />

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
          <h2 className="text-xl font-semibold">Registros</h2>
          <input
            type="text"
            placeholder="Filtrar por referência, designação ou armazém..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value)
              setPaginaAtual(1)
            }}
            className="border p-2 rounded w-full md:w-64"
          />
        </div>
        {ultimaAtualizacao && (
          <p className="text-sm text-gray-500 text-right mt-4">
            Atualizado em {ultimaAtualizacao.toLocaleDateString('pt-PT')} às{' '}
            {ultimaAtualizacao.toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}

        <p className="text-sm text-gray-500 mb-2">
          {registrosFiltrados.length} registro(s) encontrado(s)
        </p>

        <table className="min-w-full border text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('data')}>
                Data {seta('data')}
              </th>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('codigo')}>
                Referência {seta('codigo')}
              </th>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('quantidade')}>
                Quantidade {seta('quantidade')}
              </th>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('descricao')}>
                Designação {seta('descricao')}
              </th>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('observacao')}>
                Armazém {seta('observacao')}
              </th>
              <th className="border px-2 py-1 cursor-pointer" onClick={() => ordenar('estado')}>
                Estado {seta('estado')}
              </th>
              <th className="border px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {registrosPaginados.map((r, i) => (
              <tr
                key={r.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="border px-2 py-1">{new Date(r.data).toLocaleDateString('pt-PT')}</td>
                <td className="border px-2 py-1">{r.codigo}</td>
                <td className="border px-2 py-1">{r.quantidade}</td>
                <td className="border px-2 py-1">{r.descricao}</td>
                <td className="border px-2 py-1">{r.observacao}</td>
                <td className="border px-2 py-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${corEstado[r.estado as keyof typeof corEstado]}`}
                  >
                    {r.estado}
                  </span>
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => iniciarEdicao(r)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setRegistroParaExcluir(r)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                  <form id={`form-excluir-${r.id}`} action={excluirRegistro}  className="hidden">
                    <input type="hidden" name="id" value={r.id} />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPaginaAtual(1)}
              disabled={paginaAtual === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              ⏮ Início
            </button>
            <button
              onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              ◀ Anterior
            </button>
            <button
              onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
              disabled={paginaAtual === totalPaginas}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Próxima ▶
            </button>
            <button
              onClick={() => setPaginaAtual(totalPaginas)}
              disabled={paginaAtual === totalPaginas}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Fim ⏭
            </button>
          </div>
        </div>

        
      </div>

      {registroParaExcluir && (
        <Modal
          titulo="Confirmar exclusão"
          descricao={`Tem certeza que deseja excluir o item "${registroParaExcluir.codigo}"?`}
          onConfirm={() => {
            setRegistroParaExcluir(null)
            const form = document.getElementById(`form-excluir-${registroParaExcluir.id}`) as HTMLFormElement
            if (form) {
              form.requestSubmit()
              setUltimaAtualizacao(new Date())
            }
          }}
          onCancel={() => setRegistroParaExcluir(null)}
        />
      )}
    </div>
  )
}