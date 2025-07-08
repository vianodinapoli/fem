'use client'

import { useState } from 'react'
import RegistroForm from './RegistroForm'
import { excluirRegistro } from '../actions/delete'
import ExportButtons from './ExportButtons'

type Registro = {
  id: number
  data: string
  codigo: string
  quantidade: number
  descricao: string
  observacao: string
  estado: string
}

export default function RegistroList({ registros }: { registros: Registro[] }) {
  const [modoEdicao, setModoEdicao] = useState(false)
  const [registroSelecionado, setRegistroSelecionado] = useState<Registro | null>(null)

  function iniciarEdicao(registro: Registro) {
    setRegistroSelecionado(registro)
    setModoEdicao(true)
  }

  function cancelarEdicao() {
    setRegistroSelecionado(null)
    setModoEdicao(false)
  }

  const corEstado = {
    Novo: 'bg-green-100 text-green-800',
    Bom: 'bg-blue-100 text-blue-800',
    Danificado: 'bg-red-100 text-red-800',
  }

  

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{modoEdicao ? 'Editar Item' : 'Registrar Item'}</h1>

      <RegistroForm
        initial={registroSelecionado}
        modoEdicao={modoEdicao}
        setModoEdicao={setModoEdicao}
        setRegistro={setRegistroSelecionado}
      />

      {modoEdicao && (
        <button
          onClick={cancelarEdicao}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancelar edição
        </button>
      )}

      <ExportButtons registros={registros} />


      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Registros</h2>
        <table className="min-w-full border text-sm text-center min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Data</th>
              <th className="border px-2 py-1">Código</th>
              <th className="border px-2 py-1">Qtd</th>
              <th className="border px-2 py-1">Descrição</th>
              <th className="border px-2 py-1">Observação</th>
              <th className="border px-2 py-1">Estado</th>
              <th className="border px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{new Date(r.data).toLocaleDateString()}</td>
                <td className="border px-2 py-1">{r.codigo}</td>
                <td className="border px-2 py-1">{r.quantidade}</td>
                <td className="border px-2 py-1">{r.descricao}</td>
                <td className="border px-2 py-1">{r.observacao}</td>
                <td className="border px-2 py-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${corEstado[r.estado as keyof typeof corEstado]}`}>
                    {r.estado}
                  </span>
                </td>
                <td className="border px-2 py-1 space-x-2">
                  <button
                    onClick={() => iniciarEdicao(r)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <form action={excluirRegistro}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
