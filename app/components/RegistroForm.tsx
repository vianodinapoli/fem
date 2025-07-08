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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium mb-1">Data</label>
      <input
        type="date"
        name="data"
        defaultValue={registro?.data?.split('T')[0]}
        required
        className="w-full border p-2 rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Referência</label>
      <input
        type="text"
        name="codigo"
        defaultValue={registro?.codigo}
        required
        className="w-full border p-2 rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Quantidade</label>
      <input
        type="number"
        name="quantidade"
        defaultValue={registro?.quantidade || 1}
        required
        className="w-full border p-2 rounded"
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">Designação</label>
      <input
        type="text"
        name="descricao"
        defaultValue={registro?.descricao}
        required
        className="w-full border p-2 rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Estado</label>
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

    <div className="md:col-span-3">
      <label className="block text-sm font-medium mb-1">Armazém</label>
      <textarea
        name="observacao"
        defaultValue={registro?.observacao}
        className="w-full border p-2 rounded"
        rows={2}
      />
    </div>
  </div>

  <div className="pt-4">
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
