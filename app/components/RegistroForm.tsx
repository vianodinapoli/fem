'use client'

import { useRef } from 'react'
import { salvarRegistro } from '../actions/save'
import { atualizarRegistro } from '../actions/update'
import toast from 'react-hot-toast'

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

  try {
    if (modoEdicao && registro?.id) {
      formData.append('id', registro.id.toString())
      await atualizarRegistro(formData)
      toast.success('Registro atualizado com sucesso!')
    } else {
      await salvarRegistro(formData)
      toast.success('Registro salvo com sucesso!')
    }

    formRef.current?.reset()
    setModoEdicao(false)
    setRegistro(null)
  } catch (error) {
    toast.error('Erro ao salvar o registro.')
    console.error(error)
  }
}

  return (
    
   <form
  key={registro?.id || 'novo'}
  ref={formRef}
  onSubmit={handleSubmit}
  className="p-4 bg-white shadow rounded-xl space-y-4"
>
  <div className="w-full flex flex-wrap justify-center items-end gap-4">
  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium mb-1">Data</label>
    <input
      type="date"
      name="data"
      defaultValue={registro?.data?.split('T')[0]}
      required
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col w-[160px]">
    <label className="text-sm font-medium mb-1">Referência</label>
    <input
      type="text"
      name="codigo"
      defaultValue={registro?.codigo}
      required
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col w-[100px]">
    <label className="text-sm font-medium mb-1">Quantidade</label>
    <input
      type="number"
      name="quantidade"
      defaultValue={registro?.quantidade || 1}
      required
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col w-[180px]">
    <label className="text-sm font-medium mb-1">Designação</label>
    <input
      type="text"
      name="descricao"
      defaultValue={registro?.descricao}
      required
      className="border p-2 rounded"
    />
  </div>

  <div className="flex flex-col w-[150px]">
    <label className="text-sm font-medium mb-1">Estado</label>
    <select
      name="estado"
      defaultValue={registro?.estado || 'Novo'}
      className="border p-2 rounded"
    >
      <option value="Novo">Novo</option>
      <option value="Bom">Bom</option>
      <option value="Danificado">Danificado</option>
    </select>
  </div>

  <div className="flex flex-col w-[140px]">
    <label className="text-sm font-medium mb-1">Armazém</label>
    <textarea
      name="observacao"
      defaultValue={registro?.observacao}
      className="border p-2 rounded"
      rows={1}
    />
  </div>
   <div className="pt-4">
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {modoEdicao ? 'Atualizar' : 'Salvar'}
    </button>
  </div>
</div>

 
</form>
  )
}
