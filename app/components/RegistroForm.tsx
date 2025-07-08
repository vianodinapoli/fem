'use client'

import { useRef } from 'react'
import { salvarRegistro } from '../actions/save'
import { atualizarRegistro } from '../actions/update'

type Props = {
  initial?: any
  modoEdicao: boolean
  setModoEdicao: (valor: boolean) => void
  setRegistro: (registro: any) => void
}

export default function RegistroForm({
  initial,
  modoEdicao,
  setModoEdicao,
  setRegistro,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const registro = initial

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (modoEdicao && registro?.id) {
      formData.append('id', registro.id.toString())
      await atualizarRegistro(formData)
    } else {
      await salvarRegistro(formData)
    }

    formRef.current?.reset()
    setModoEdicao(false)
    setRegistro(null)
  }

  return (
  <form
    key={registro?.id || 'novo'}
    ref={formRef}
    onSubmit={handleSubmit}
    className="p-4 bg-white shadow rounded-xl space-y-4"
  >
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[220px]">
        <label>Data</label>
        <input
          type="date"
          name="data"
          defaultValue={registro?.data?.split('T')[0]}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex-1 min-w-[220px]">
        <label>Código</label>
        <input
          type="text"
          name="codigo"
          defaultValue={registro?.codigo}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex-1 min-w-[220px]">
        <label>Quantidade</label>
        <input
          type="number"
          name="quantidade"
          defaultValue={registro?.quantidade || 1}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex-1 min-w-[220px]">
        <label>Descrição</label>
        <input
          type="text"
          name="descricao"
          defaultValue={registro?.descricao}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex-1 min-w-[220px]">
        <label>Observação</label>
        <textarea
          name="observacao"
          defaultValue={registro?.observacao}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="flex-1 min-w-[220px]">
        <label>Estado</label>
        <select
          name="estado"
          defaultValue={registro?.estado || 'Novo'}
          className="w-full border p-2 rounded"
        >
          <option value="Novo">Novo</option>
          <option value="Bom">Bom</option>
          <option value="Danificado">Danificado</option>
        </select>
      </div>
    </div>

    <div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {modoEdicao ? 'Atualizar' : 'Salvar'}
      </button>
    </div>
  </form>

  )
}
